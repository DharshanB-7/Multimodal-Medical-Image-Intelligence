# Multimodal Medical Image Intelligence

An AI-assisted **clinical decision-support** prototype. A clinician uploads a medical image and enters patient context; the system returns possible findings with confidence, supporting evidence, an explanation and a highlighted image region for review.

> **Disclaimer:** This is a research prototype. It is not clinically validated, not a certified medical device, and not a replacement for a qualified medical professional. Outputs are AI-assisted observations to be reviewed by a clinician and must not be used as a standalone diagnosis or treatment decision. Do not use real patient data.

---

## 1. What it does

- Upload a medical image (PNG, JPG, JPEG, WEBP, up to 10 MB).
- Enter age, sex, symptoms, clinical notes and test results.
- Send the image and context to a FastAPI backend.
- Analyze them with **MedGemma 1.5 4B**, run locally through **Ollama**.
- Show possible findings, confidence scores, evidence and explanations.
- Draw suspected regions as bounding boxes, with an optional heatmap overlay.
- Hide findings below a configurable confidence threshold.

```text
Image + Age/Sex + Symptoms/Notes/Tests
        -> Next.js frontend -> REST API -> FastAPI backend
        -> image preprocessing -> MedGemma 1.5 4B (Ollama)
        -> evidence / confidence / location validation
        -> JSON result -> findings, evidence, confidence, explanation
```

## 2. Technologies

| Layer | Stack |
|---|---|
| Frontend | Next.js (App Router), React, TypeScript, Tailwind CSS, Lucide icons, `fetch`; browser storage for demo history |
| Backend | Python 3.10+, FastAPI, Uvicorn, Pydantic, Pillow, pytest, CORS middleware |
| AI | Ollama (local inference) with MedGemma 1.5 4B, used pretrained and not trained or fine-tuned here |

## 3. Repository structure

```text
medical-image-intelligence/
├── README.md                 <- this file (full project documentation)
├── medical-ai-backend/       FastAPI backend (app/, docs/, tests/, storage/, run.py, requirements.txt, .env.example)
└── mii/                      Next.js frontend (app/, components/, lib/, public/, .env.example, package.json)
```

The backend and frontend folders may also contain their own short READMEs.

## 4. Prerequisites

Python 3.10+, Node.js and npm, Git, and [Ollama](https://ollama.com). Check them:

```bash
python --version && node --version && npm --version && ollama --version
```

## 5. Install

**Backend**

```bash
cd medical-ai-backend
python -m venv .venv
```

Activate the environment:

| System | Command |
|---|---|
| Windows (PowerShell) | `.\.venv\Scripts\Activate.ps1` |
| Windows (Command Prompt) | `.venv\Scripts\activate` |
| macOS / Linux | `source .venv/bin/activate` |

```bash
pip install -r requirements.txt
```

**Frontend** (in a second terminal)

```bash
cd mii
npm install
```

## 6. Configure

**Backend**: copy `.env.example` to `.env` (`cp .env.example .env` on macOS/Linux, `copy .env.example .env` on Windows). Variable names come from `.env.example`; typical values:

```env
OLLAMA_BASE_URL=http://localhost:11434
MODEL_NAME=medgemma1.5:4b
MODEL_VERSION=4B
FRONTEND_URL=http://localhost:3000
ENVIRONMENT=development
MAX_UPLOAD_SIZE_MB=10
REQUEST_TIMEOUT_SECONDS=120
MOCK_MODEL=false
STORAGE_DIR=storage
```

**Frontend**: copy `mii/.env.example` to `mii/.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_USE_MOCK_API=false
```

Restart `npm run dev` after any change to environment variables.

## 7. Run

Three processes, one terminal each.

1. **Ollama**: `ollama pull medgemma1.5:4b`, then `ollama list` to confirm. If the server is not already running, start it with `ollama serve` (it listens on `http://localhost:11434`).
2. **Backend** (virtual environment active):
   ```bash
   cd medical-ai-backend
   python -m uvicorn app.main:app --reload --port 8000
   ```
   Check `curl http://localhost:8000/health`. API docs are at `http://localhost:8000/docs`.
3. **Frontend**:
   ```bash
   cd mii
   npm run dev
   ```
   Open `http://localhost:3000`.

## 8. Try it (demo walkthrough)

1. Open the app and choose **Start Analysis**.
2. Upload a **de-identified or publicly available** sample image.
3. Enter sample context, for example: age `54`, sex `Male`, symptoms `fever and productive cough for 3 days`. Add clinical notes and test results if you have sample text.
4. Set the confidence threshold (the prototype uses **70%**), then select **Analyze Image**. The frontend sends `POST /api/v1/analyze` as `multipart/form-data`.
5. Review the result: assessment, confidence, highlighted region (toggle Original / AI Evidence), findings, clinical context, explanation, recommendation and warnings.

Output varies with the image, the context and the model. Use the exact inputs from a recorded demo if you need to reproduce a specific result.

**No Ollama?** Use [mock mode](#11-mock-mode) to run the full interface.

## 9. Confidence threshold

The threshold filters out lower-confidence observations in the interface.

```text
confidence 95%, threshold 70%  ->  shown
confidence 65%, threshold 70%  ->  hidden (below threshold)
```

A confidence score here is the model's own estimate. It is **not** a calibrated probability, and a 70% threshold does not mean 70% diagnostic accuracy. A clinical system would need a threshold chosen on a labelled validation set using sensitivity, specificity, precision, recall and false-negative rate.

## 10. Evidence, localization and validation

The backend checks model output before returning it:

1. Image validation and preprocessing.
2. Structured prompting of the model.
3. Validation of confidence values and model-provided locations.
4. Traceability of clinical evidence.
5. Removal or softening of unsupported or overly definitive statements.
6. An insufficient-evidence result when reliable evidence is not available.

Bounding-box coordinates are in pixels of the **original uploaded image**. The frontend converts them to percentages so boxes stay aligned at any size or zoom. A heatmap, when provided, is shown as an image overlay. Model-generated locations are approximate and are not validated detection or segmentation.

## 11. Mock mode

| Mode | Setting | Effect |
|---|---|---|
| Frontend mock | `NEXT_PUBLIC_USE_MOCK_API=true` | Built-in sample results. No backend or Ollama needed. |
| Backend mock | `MOCK_MODEL=true` | Backend returns deterministic sample results. No Ollama needed. |
| Real AI | `NEXT_PUBLIC_USE_MOCK_API=false` and `MOCK_MODEL=false` | Full workflow with Ollama and MedGemma. |

## 12. API

| Method | Path | Purpose |
|---|---|---|
| GET | `/health` | Service health |
| GET | `/api/v1/model/status` | Model availability |
| POST | `/api/v1/analyze` | Analyze an image with context |
| GET | `/api/v1/analysis/{id}/annotated-image` | Annotated image |

`POST /api/v1/analyze` fields: `image`, `patient_age`, `patient_sex`, `clinical_notes`, `symptoms`, `test_results`. Full details: `http://localhost:8000/docs`.

Example response (shortened):

```json
{
  "analysis_id": "ANL-0001",
  "model": { "name": "medgemma1.5", "version": "4B" },
  "assessment": { "summary": "Possible finding requiring clinical review", "overall_confidence": 0.87 },
  "findings": [{
    "id": "finding_1",
    "label": "Possible abnormality",
    "confidence": 0.87,
    "location": { "x": 120, "y": 80, "width": 250, "height": 180 },
    "evidence": "Supporting visual evidence",
    "clinical_context": "Relevant patient context",
    "explanation": "AI-assisted explanation"
  }],
  "clinical_context": { "used": true, "summary": "Relevant clinical information was considered." },
  "recommendation": "Consider reviewing the highlighted region.",
  "disclaimer": "This system is an AI-assisted clinical decision-support tool and is not a replacement for a qualified medical professional."
}
```

## 13. Testing

```bash
cd medical-ai-backend
python -m pytest -q
```

The backend tests cover the health endpoint, Ollama availability, invalid, corrupt, oversized and unsupported images, missing fields, mock responses, invalid model JSON, timeouts, schema, confidence, location and evidence rules, image endpoints and CORS. The frontend can be checked with `npm run typecheck` and `npm run build` in `mii/`.

## 14. Troubleshooting

| Symptom | Likely cause and fix |
|---|---|
| "Unable to connect to the AI analysis service" | Backend is not running, or `NEXT_PUBLIC_API_URL` is wrong. Check `/health`, then restart the frontend. |
| Browser CORS error | `FRONTEND_URL` in the backend `.env` does not match the frontend address. |
| Backend reports model unavailable | Ollama is not running or the model is not pulled. Run `ollama list` and `ollama pull medgemma1.5:4b`. |
| Analysis times out | Local inference can be slow. Try a smaller image or raise `REQUEST_TIMEOUT_SECONDS`. |
| UI shows sample results | `NEXT_PUBLIC_USE_MOCK_API` is `true`. Set it to `false` and restart. |

## 15. Possible uses

Potential future uses, each needing clinical validation first: radiology second-opinion support, chest X-ray screening support, clinical decision support combining image and patient context, telemedicine image review, and medical education and research. The current prototype handles single 2D images only. It does not support CT/MRI volumes, DICOM or triage.

## 16. Limitations

- Not clinically validated and not a certified medical device.
- MedGemma is used pretrained; this project does not train it.
- Model confidence is not a calibrated probability of being correct.
- Model-generated localization is not validated detection or segmentation.
- False positives and false negatives are possible, and the absence of a finding does not exclude disease.
- It works on uploaded images, not a full clinical imaging setup.
- Real deployment would need authentication, encryption, access control, audit logging, retention policies, clinical validation and regulatory compliance.
- Results require review by a qualified healthcare professional.

## 17. Future work

Specialized detection and segmentation models, calibrated confidence, DICOM and multi-slice support, larger validation datasets with sensitivity, specificity and ROC-AUC evaluation, external validation across sites, better handling of low-quality images, role-based authentication, encrypted storage, audit logging and retention controls, and PACS/HIS integration where appropriate.

## 18. Summary

The project combines a clinician-facing web interface, a FastAPI backend, local Ollama inference and MedGemma 1.5 4B into one workflow: medical image plus clinical context, validated evidence and localization, confidence filtering, and a visual review for the clinician. It supports review. It does not diagnose.
