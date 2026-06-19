# CLAUDE.md — MarkItDown Codebase Guide

## Project Overview

MarkItDown is a lightweight Python library (by Microsoft AutoGen) that converts 20+ file formats to Markdown for use with LLMs and text-analysis pipelines. It preserves document structure (headings, tables, lists, links) while producing token-efficient Markdown output.

- **Python:** ≥ 3.10
- **License:** MIT
- **Version:** managed in `packages/markitdown/src/markitdown/__about__.py` (currently 0.1.6, beta)
- **Build system:** Hatchling
- **Formatter:** Black 23.7.0 (enforced via pre-commit and CI)

---

## Repository Layout

```
markitdown/
├── packages/
│   ├── markitdown/               # Core library
│   ├── markitdown-ocr/           # Plugin: LLM-based OCR for embedded images
│   ├── markitdown-mcp/           # Plugin: MCP server exposing markitdown as a tool
│   └── markitdown-sample-plugin/ # Template for building custom plugins
├── .github/workflows/
│   ├── tests.yml                 # CI: hatch test on PRs (Python 3.10–3.12)
│   └── pre-commit.yml            # CI: Black formatting check on PRs
├── .pre-commit-config.yaml       # Black hook
├── Dockerfile
└── vibecoding_docs.md
```

### Core package layout (`packages/markitdown/src/markitdown/`)

```
markitdown/
├── __about__.py          # Version string
├── __init__.py           # Public API re-exports
├── __main__.py           # CLI entry point (argparse)
├── _markitdown.py        # MarkItDown orchestrator class
├── _base_converter.py    # DocumentConverter + DocumentConverterResult abstracts
├── _stream_info.py       # StreamInfo frozen dataclass
├── _exceptions.py        # Exception hierarchy
├── converters/           # One file per format
│   ├── _pdf_converter.py
│   ├── _docx_converter.py
│   ├── _xlsx_converter.py
│   ├── _pptx_converter.py
│   ├── _html_converter.py
│   ├── _image_converter.py
│   ├── _audio_converter.py
│   ├── _csv_converter.py
│   ├── _epub_converter.py
│   ├── _ipynb_converter.py
│   ├── _zip_converter.py
│   ├── _youtube_converter.py
│   ├── _wikipedia_converter.py
│   ├── _rss_converter.py
│   ├── _bing_serp_converter.py
│   ├── _outlook_msg_converter.py
│   ├── _plain_text_converter.py
│   ├── _doc_intel_converter.py   # Azure Document Intelligence
│   ├── _cu_converter.py          # Azure Content Understanding
│   ├── _markdownify.py           # Custom HTML→Markdown helper
│   ├── _llm_caption.py           # LLM image captioning
│   ├── _exiftool.py              # EXIF metadata extraction
│   └── _transcribe_audio.py      # Audio transcription helper
└── converter_utils/
    └── docx/
        ├── pre_process.py        # DOCX preprocessing
        └── math/
            ├── omml.py           # OpenML → MathML formula conversion
            └── latex_dict.py     # LaTeX symbol tables
```

---

## Core Architecture

### Key Classes

**`DocumentConverter`** (`_base_converter.py`)
Abstract base for all converters. Two methods must be implemented:
- `accepts(file_stream, stream_info, **kwargs) -> bool` — fast check whether this converter handles the file
- `convert(file_stream, stream_info, **kwargs) -> DocumentConverterResult` — perform conversion

**Critical rule:** If `accepts()` reads from `file_stream`, it **must** reset the position via `file_stream.seek(cur_pos)` before returning, because `convert()` will immediately follow.

**`DocumentConverterResult`** (`_base_converter.py`)
- `markdown: str` — the converted content (primary field)
- `title: Optional[str]` — optional document title
- `text_content` — soft-deprecated alias for `markdown`; new code should use `.markdown` or `str(result)`

**`StreamInfo`** (`_stream_info.py`) — frozen dataclass carrying file metadata:
- `mimetype`, `extension`, `charset`, `filename`, `local_path`, `url` (all optional)
- `copy_and_update(**kwargs)` — returns a new instance with fields overridden

**`MarkItDown`** (`_markitdown.py`) — orchestrator:
- Maintains a priority-sorted list of converters
- `register_converter(converter, priority)` — add a converter
- Loads plugins from `markitdown.plugin` entry points at init
- Conversion entry points:
  - `convert(source)` — auto-detect: file path, URL string, stream, or `requests.Response`
  - `convert_local(path)` — local file
  - `convert_uri(uri)` — `file:`, `data:`, `http:`, `https:` URIs
  - `convert_stream(stream, **kwargs)` — binary stream
  - `convert_response(response, **kwargs)` — `requests.Response`

### Converter Priority

```python
PRIORITY_SPECIFIC_FILE_FORMAT = 0.0   # format-specific converters
PRIORITY_GENERIC_FILE_FORMAT  = 10.0  # fallback converters (plain text, HTML)
```

Plugins can use **negative priorities** (e.g., `-1.0`) to override built-in converters. The OCR plugin uses `-1.0` to intercept PDF/DOCX/PPTX/XLSX before the default converters.

### Exception Hierarchy (`_exceptions.py`)

```
MarkItDownException
├── MissingDependencyException   # optional dep not installed
├── UnsupportedFormatException   # no converter matched
└── FailedConversionAttempt      # converter matched but failed
```

---

## Development Workflow

### Setup

```bash
cd packages/markitdown
pip install hatch          # or: pipx install hatch
hatch shell                # activates env with all optional deps
```

### Running Tests

```bash
cd packages/markitdown
hatch test                 # full suite across Python matrix
hatch shell && pytest tests/              # single environment
hatch shell && pytest tests/test_module_vectors.py  # specific file
```

### Formatting

```bash
pre-commit run --all-files    # must pass before submitting a PR
# or manually:
black src/ tests/
```

### Type Checking

```bash
cd packages/markitdown
hatch run types:check
```

### CI

| Workflow | Trigger | What it does |
|---|---|---|
| `tests.yml` | Pull requests | `hatch test` on Python 3.10, 3.11, 3.12 |
| `pre-commit.yml` | Pull requests | Black formatting check |

Remote tests (YouTube, Wikipedia, etc.) are **skipped in CI** via `if os.environ.get("GITHUB_ACTIONS")`. LLM tests require `OPENAI_API_KEY`.

---

## Testing Conventions

Test files live in `packages/markitdown/tests/`. Test input files live in `packages/markitdown/tests/test_files/`.

| File | What it covers |
|---|---|
| `test_module_vectors.py` | Module-level conversion correctness |
| `test_module_misc.py` | LLM client, exiftool, transcription options |
| `test_cli_vectors.py` | CLI conversion correctness |
| `test_cli_misc.py` | CLI flags and edge cases |
| `test_pdf_*.py` | PDF-specific: memory, tables, numbering |
| `test_cu_converter.py` | Azure Content Understanding |
| `test_docintel_html.py` | Azure Document Intelligence |
| `_test_vectors.py` | Shared test infrastructure |

Tests use `pytest.mark.skip` with reason strings for:
- Optional format dependencies (pdf, docx, xlsx, audio, youtube, llm, exiftool)
- Network-dependent tests (`GITHUB_ACTIONS` env check)

---

## Adding a New Converter

1. Create `packages/markitdown/src/markitdown/converters/_<format>_converter.py`
2. Subclass `DocumentConverter`; implement `accepts()` and `convert()`
3. Import and register in `packages/markitdown/src/markitdown/converters/__init__.py`
4. Register in `MarkItDown.__init__` in `_markitdown.py` with appropriate priority
5. Add optional dependency under `[project.optional-dependencies]` in `pyproject.toml` if needed
6. Add test vectors and test cases under `tests/`

### Converter Pattern

```python
class MyFormatConverter(DocumentConverter):
    ACCEPTED_EXTENSIONS = {".myext"}
    ACCEPTED_MIME_TYPES = {"application/x-myformat"}

    def accepts(self, file_stream, stream_info, **kwargs):
        ext = (stream_info.extension or "").lower()
        mime = (stream_info.mimetype or "").lower()
        return ext in self.ACCEPTED_EXTENSIONS or mime in self.ACCEPTED_MIME_TYPES

    def convert(self, file_stream, stream_info, **kwargs):
        # Try importing optional dependency; surface helpful error if missing
        try:
            import mylib
        except ImportError:
            raise MissingDependencyException("mylib", "myformat")

        content = mylib.parse(file_stream)
        return DocumentConverterResult(markdown=content, title=content.title)
```

**Lazy dependency errors:** Store `sys.exc_info()` in `__init__` and re-raise in `convert()` to give a clear error only when the converter is actually invoked, not at import time.

---

## Plugin System

Plugins use Python entry points under the `markitdown.plugin` group.

### Plugin `pyproject.toml`

```toml
[project.entry-points."markitdown.plugin"]
my-plugin = "my_package.plugin"
```

### Plugin module must export

```python
__plugin_interface_version__ = 1

def register_converters(markitdown, **kwargs):
    markitdown.register_converter(MyConverter(), priority=-1.0)
```

Plugin load failures emit a warning but are never fatal. See `markitdown-sample-plugin` for a complete working template.

---

## Optional Dependencies

Install groups via pip extras:

| Extra | Dependencies |
|---|---|
| `[pdf]` | pdfminer.six, pdfplumber |
| `[docx]` | mammoth, lxml |
| `[pptx]` | python-pptx |
| `[xlsx]` | pandas, openpyxl |
| `[xls]` | pandas, xlrd |
| `[outlook]` | olefile |
| `[audio-transcription]` | pydub, SpeechRecognition |
| `[youtube-transcription]` | youtube-transcript-api |
| `[az-doc-intel]` | azure-ai-documentintelligence, azure-identity |
| `[az-content-understanding]` | azure-ai-contentunderstanding≥1.2.0b1, azure-identity |
| `[all]` | Everything above |

---

## Naming & File Conventions

- Converter files: `_<format>_converter.py` (leading underscore = private module)
- Utility files: `_<utility>.py`
- All internal modules use leading underscore; only `__init__.py` re-exports public API
- Class names: `PascalCase`, e.g., `PdfConverter`, `HtmlConverter`
- Constants: `SCREAMING_SNAKE_CASE`
- No comments explaining *what* code does — only *why* when non-obvious

---

## Security Notes

- MarkItDown performs file I/O with the process's own privileges — **always sanitize or validate untrusted input before passing it to MarkItDown**
- Prefer the narrowest conversion API for untrusted inputs: `convert_stream()` over `convert()` when you control the stream
- `defusedxml` is used for XML parsing to prevent entity-expansion attacks
- The MCP server binds to localhost by default; binding to non-local interfaces requires explicit configuration and carries risk — see MCP package README

---

## Multi-Package Notes

Each sub-package under `packages/` is independently installable and has its own `pyproject.toml`. When working across packages:

- `markitdown-ocr`: OCR plugin; registers at priority `-1.0`; outputs `*[Image OCR]...[End OCR]*` blocks
- `markitdown-mcp`: Exposes single MCP tool `convert_to_markdown(uri)`; supports STDIO, HTTP Streamable, and SSE transports
- `markitdown-sample-plugin`: Minimal RTF converter example — use as a starting point for new plugins
