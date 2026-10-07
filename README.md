# Multimodal Medical Image Intelligence

## 1. What the Project Does

**Multimodal Medical Image Intelligence** is a clinician-facing AI-assisted clinical decision-support system for analyzing medical images together with patient clinical context.

The system allows a user to:

- Upload a medical image.
- Enter patient age and sex.
- Provide symptoms, clinical notes, and test results.
- Send the image and clinical context to a FastAPI backend.
- Analyze the input using **MedGemma 1.5 4B** through **Ollama**.
- Display possible AI-assisted findings.
- Show confidence scores and apply a configurable confidence threshold.
- Present supporting evidence and explanations.
- Visualize suspected regions using bounding boxes and optional heatmaps.
- Review the result through a web-based clinician-oriented interface.

The system is intended as an **AI-assisted clinical decision-support tool and not as a replacement for a qualified medical professional**.

### High-level workflow

```text
Medical Image
      +
Patient Age / Sex
      +
Symptoms / Clinical Notes / Test Results
      ↓
Next.js Frontend
      ↓
REST API
      ↓
FastAPI Backend
      ↓
Image Preprocessing
      ↓
MedGemma 1.5 4B via Ollama
      ↓
Evidence / Confidence / Localization Processing
      ↓
Analysis Result
      ↓
Frontend Visualization
      ↓
Finding + Evidence + Confidence + Explanation
```

---

## 2. Technologies, Libraries, and Models Used

### Frontend

- **Next.js**
- **React**
- **TypeScript**
- **Tailwind CSS**
- Browser storage for demo history/current results
- REST API integration using `fetch`

### Backend

- **Python**
- **FastAPI**
- **Uvicorn**
- **Pydantic**
- **Pillow** for image processing
- **pytest** for testing
- REST API with multipart image upload
- CORS middleware

### AI / Model Layer

- **Ollama** for local model execution
- **MedGemma 1.5 4B** as the medical vision-language model

The model is used as a pretrained multimodal model. The project does not train MedGemma from scratch.

### Main project components

```text
Frontend:
Next.js → Patient Context → Image Upload → Results Visualization

Backend:
FastAPI → Image Processing → MedGemma/Ollama → Evidence Validation
        → Confidence/Localization Processing → JSON Response
```

---

## 3. Repository Structure

The public Git repository contains both the frontend and backend:

```text
medical-image-intelligence/
│
├── README.md
│
├── medical-ai-backend/
│   ├── app/
│   │   ├── main.py
│   │   ├── api/
│   │   ├── core/
│   │   ├── schemas/
│   │   ├── services/
│   │   └── utils/
│   ├── docs/
│   ├── tests/
│   ├── storage/
│   ├── .env.example
│   ├── requirements.txt
│   └── run.py
│
└── mii/
    ├── app/
    ├── components/
    ├── lib/
    ├── public/
    ├── .env.example
    ├── package.json
    └── next.config.ts
```

The root `README.md` is the complete project documentation. The frontend and backend may also contain their own component-specific README files.

---

## 4. How to Install Dependencies

### Prerequisites

Install the following before running the project:

- **Python 3.10+**
- **Node.js and npm**
- **Ollama**
- Git

Verify the installations:

```bash
python --version
node --version
npm --version
ollama --version
```

### 4.1 Install Backend Dependencies

Open a terminal in the repository root:

```bash
cd medical-ai-backend
```

Create a Python virtual environment:

### Windows

```powershell
python -m venv .venv
.\.venv\Scripts\Activate.ps1
```

If PowerShell activation is restricted, use Command Prompt:

```cmd
.venv\Scripts\activate
```

Install the backend dependencies:

```bash
pip install -r requirements.txt
```

### 4.2 Install Frontend Dependencies

Open another terminal:

```bash
cd mii
npm install
```

---

## 5. How to Configure the System

### 5.1 Backend Configuration

Inside `medical-ai-backend`, copy the example environment file:

```bash
copy .env.example .env
```

On systems where `cp` is available:

```bash
cp .env.example .env
```

Configure the important values in `.env`:

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

The exact variable names should match the `.env.example` file included in the repository.

### 5.2 Frontend Configuration

Inside `mii`, configure `.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_USE_MOCK_API=false
```

`NEXT_PUBLIC_API_URL` specifies the FastAPI backend.

`NEXT_PUBLIC_USE_MOCK_API=true` can be used to demonstrate the frontend without running the AI backend.

Restart the Next.js development server after changing environment variables.

---

## 6. How to Configure and Run the System

The project uses three local services/processes:

```text
Terminal 1 → Ollama
Terminal 2 → FastAPI Backend
Terminal 3 → Next.js Frontend
```

### Step 1: Start Ollama

Make sure Ollama is installed and running.

Pull the model:

```bash
ollama pull medgemma1.5:4b
```

Check available models:

```bash
ollama list
```

The backend expects Ollama at:

```text
http://localhost:11434
```

If required, start the Ollama server:

```bash
ollama serve
```

### Step 2: Start the FastAPI Backend

Open a new terminal:

```bash
cd medical-ai-backend
```

Activate the virtual environment:

```powershell
.\.venv\Scripts\Activate.ps1
```

Run FastAPI:

```bash
python -m uvicorn app.main:app --reload --port 8000
```

The backend should be available at:

```text
http://localhost:8000
```

Swagger API documentation:

```text
http://localhost:8000/docs
```

Check the backend:

```bash
curl http://localhost:8000/health
```

### Step 3: Start the Frontend

Open another terminal:

```bash
cd mii
npm run dev
```

The frontend should be available at:

```text
http://localhost:3000
```

Open this address in a browser.

---

# 7. How to Reproduce the Demonstrated Results

Follow these steps to reproduce the demonstrated workflow.

### Step 1 — Start Ollama

```bash
ollama list
```

Confirm that the MedGemma model is available.

If it is not installed:

```bash
ollama pull medgemma1.5:4b
```

### Step 2 — Start the Backend

```bash
cd medical-ai-backend
.\.venv\Scripts\Activate.ps1
python -m uvicorn app.main:app --reload --port 8000
```

Verify:

```text
http://localhost:8000/docs
```

### Step 3 — Start the Frontend

In a separate terminal:

```bash
cd mii
npm run dev
```

Open:

```text
http://localhost:3000
```

### Step 4 — Provide an Image

Upload a supported medical image through the frontend.

The backend validates the image before sending it to the model.

### Step 5 — Enter Clinical Context

Enter the available patient information, such as:

```text
Patient Age: 54
Patient Sex: Male

Symptoms:
fever and productive cough for 3 days

Clinical Notes:
Relevant clinical history

Test Results:
Available test information
```

Use the actual demonstration input when reproducing a specific result.

### Step 6 — Run Analysis

Submit the image and patient information.

The frontend sends:

```text
POST /api/v1/analyze
```

using `multipart/form-data`.

The backend processes the request and sends the image/context to MedGemma through Ollama.

### Step 7 — Review the Result

The frontend displays the returned analysis, including available:

- Finding
- Confidence
- Evidence
- Clinical context
- Explanation
- Recommendation
- Bounding-box localization
- Heatmap
- Warnings/disclaimer

The response follows the project's `AnalysisResponse` structure.

Example:

```json
{
  "analysis_id": "ANL-0001",
  "model": {
    "name": "medgemma1.5",
    "version": "4B"
  },
  "assessment": {
    "summary": "Possible finding requiring clinical review",
    "overall_confidence": 0.87
  },
  "findings": [
    {
      "id": "finding_1",
      "label": "Possible abnormality",
      "confidence": 0.87,
      "location": {
        "x": 120,
        "y": 80,
        "width": 250,
        "height": 180
      },
      "evidence": "Supporting visual evidence",
      "clinical_context": "Relevant patient context",
      "explanation": "AI-assisted explanation"
    }
  ]
}
```

---

## 8. Confidence Threshold

The frontend can use a configurable confidence threshold to filter lower-confidence observations.

For the current prototype, a **70% operating threshold** can be used.

Example:

```text
AI confidence = 95%
Threshold      = 70%

95% >= 70%
       ↓
Finding passes the filter
```

Another example:

```text
AI confidence = 65%
Threshold      = 70%

65% < 70%
       ↓
Finding is below the configured threshold
```

The threshold is a filtering mechanism and **does not mean that a 70% confidence score represents 70% diagnostic accuracy**.

For a clinically validated system, the threshold would need to be determined using an appropriate labeled validation dataset and evaluation of measures such as sensitivity, specificity, precision, recall, and false-negative rate.

---

## 9. Evidence and Localization

The backend includes validation logic for model-generated output.

The processing pipeline includes:

1. Image validation and preprocessing.
2. Structured model prompting.
3. Validation of model confidence values.
4. Validation of model-provided locations.
5. Clinical evidence traceability.
6. Removal/softening of unsupported or overly definitive findings.
7. Returning an insufficient-evidence state when reliable evidence is unavailable.

Bounding-box coordinates are represented relative to the original uploaded image and converted by the frontend for responsive visualization.

A heatmap, when provided, is displayed as an image overlay.

---

## 10. API Endpoints

### Health

```http
GET /health
```

### Model Status

```http
GET /api/v1/model/status
```

### Medical Image Analysis

```http
POST /api/v1/analyze
```

Multipart fields include:

```text
image
patient_age
patient_sex
clinical_notes
symptoms
test_results
```

### Annotated Image

```http
GET /api/v1/analysis/{id}/annotated-image
```

Full API documentation is available through:

```text
http://localhost:8000/docs
```

---

## 11. Mock Mode

The project can be demonstrated without Ollama.

### Backend mock mode

Set:

```env
MOCK_MODEL=true
```

The backend returns deterministic sample results.

### Frontend mock mode

Set:

```env
NEXT_PUBLIC_USE_MOCK_API=true
```

The frontend uses built-in mock results and does not require the backend for the UI demonstration.

For the actual demonstrated AI workflow, use:

```env
NEXT_PUBLIC_USE_MOCK_API=false
MOCK_MODEL=false
```

with Ollama and MedGemma running.

---

## 12. Testing

Run backend tests:

```bash
cd medical-ai-backend
python -m pytest -q
```

The test suite covers areas including:

- Health endpoint
- Ollama availability
- Invalid images
- Corrupt images
- Oversized images
- Unsupported image formats
- Missing request fields
- Mock model responses
- Invalid model JSON
- Timeouts
- Schema validation
- Confidence validation
- Location validation
- Evidence rules
- Image endpoints
- CORS

---

## 13. Applications in the Medical Industry

Potential applications include:

1. **Radiology assistance and second-opinion support**
2. **Brain MRI/CT abnormality analysis**
3. **Chest X-ray screening**
4. **Clinical decision-support using image and patient context**
5. **Emergency case prioritization and triage**
6. **Telemedicine and remote image review**
7. **Medical research**
8. **Medical education and training**
9. **Clinical documentation assistance**

The system is intended to support healthcare professionals rather than independently diagnose patients.

---

## 14. Limitations

This project is a prototype and has important limitations:

- It is **not clinically validated**.
- It is not a certified medical device.
- MedGemma is used as a pretrained model and is not trained specifically by this project.
- Model-generated confidence should not automatically be interpreted as a calibrated probability of diagnostic correctness.
- Model-generated localization is not equivalent to validated medical-image detection or segmentation.
- False positives and false negatives are possible.
- Absence of an AI finding does not exclude disease.
- The system currently focuses on uploaded images rather than a complete clinical imaging infrastructure.
- Real-world deployment would require authentication, encryption, access control, audit logging, retention policies, clinical validation, and appropriate regulatory compliance.
- Results require review by a qualified healthcare professional.

---

## 15. Future Enhancements

Possible future improvements include:

- Specialized medical-image detection models.
- Segmentation models for precise lesion boundaries.
- Calibrated confidence estimation.
- DICOM and multi-slice CT/MRI support.
- Larger clinical validation datasets.
- Sensitivity/specificity and ROC-AUC evaluation.
- External validation across hospitals/datasets.
- Improved low-quality image handling.
- Role-based authentication.
- Encryption and secure medical-data storage.
- Audit logging and data-retention controls.
- Integration with hospital information systems/PACS where appropriate.

---

## 16. Project Summary

**Multimodal Medical Image Intelligence** integrates a web-based clinical interface, FastAPI backend, local Ollama inference, and MedGemma 1.5 4B to create a multimodal medical-image analysis workflow.

The main contribution is the integration of:

```text
Medical Image
      +
Clinical Context
      +
Medical Vision-Language Model
      +
Evidence
      +
Localization
      +
Confidence Filtering
      +
Clinician-facing Visualization
```

This creates a unified AI-assisted workflow for reviewing medical images together with relevant patient information.

> **Disclaimer:** This project is an AI-assisted clinical decision-support prototype. It is not a replacement for a qualified medical professional, and its outputs should not be used as a standalone diagnosis or treatment decision.
#   M u l t i m o d a l - M e d i c a l - I m a g e - I n t e l l i g e n c e  
 #   M u l t i m o d a l - M e d i c a l - I m a g e - I n t e l l i g e n c e  
 