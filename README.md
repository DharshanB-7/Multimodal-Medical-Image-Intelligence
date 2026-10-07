# Multimodal Medical Image Intelligence

AI-assisted clinical decision-support system for analyzing medical images together with patient clinical context.

> **Disclaimer:** This project is a prototype for research and demonstration purposes. It is not a medical device, is not clinically validated, and is not a replacement for a qualified medical professional.

## 1. What the Project Does

**Multimodal Medical Image Intelligence** combines a medical image with patient information such as age, sex, symptoms, clinical notes, and test results.

The system is designed to:

- Upload a medical image.
- Collect patient clinical context.
- Send the image and clinical context to a FastAPI backend.
- Analyze the input using **MedGemma 1.5 4B** through **Ollama**.
- Generate possible AI-assisted findings.
- Display confidence information and apply a configurable confidence threshold.
- Provide supporting evidence and an explanation.
- Visualize suspected regions using bounding boxes and optional heatmaps.
- Present the result through a web-based clinician-oriented interface.

### High-Level Workflow

```text
Medical Image + Patient Context
              |
              v
       Next.js Frontend
              |
              v
          REST API
              |
              v
       FastAPI Backend
              |
              v
      Image Preprocessing
              |
              v
    MedGemma 1.5 4B / Ollama
              |
              v
 Evidence + Confidence + Localization
              |
              v
       Analysis Result
              |
              v
      Frontend Visualization
```

The system is intended to support clinical review. AI-generated results must be reviewed by an appropriately qualified healthcare professional.

---

## 2. Technologies, Libraries, and Models Used

### Frontend

| Technology | Purpose |
| --- | --- |
| Next.js | Web application framework |
| React | User interface |
| TypeScript | Type-safe frontend development |
| Tailwind CSS | Interface styling |
| Fetch / REST API | Frontend-backend communication |

### Backend

| Technology | Purpose |
| --- | --- |
| Python | Backend development |
| FastAPI | REST API framework |
| Uvicorn | ASGI server |
| Pydantic | Request and response validation |
| Pillow | Image processing |
| pytest | Backend testing |
| CORS Middleware | Frontend-backend communication |

### AI / Model Layer

| Technology | Purpose |
| --- | --- |
| Ollama | Local AI model execution |
| MedGemma 1.5 4B | Medical vision-language model |

**MedGemma is used as a pretrained model. This project does not train MedGemma from scratch.**

---

## 3. Repository Structure

```text
medical-image-intelligence/
|
|-- README.md
|
|-- medical-ai-backend/
|   |-- app/
|   |   |-- main.py
|   |   |-- api/
|   |   |-- core/
|   |   |-- schemas/
|   |   |-- services/
|   |   `-- utils/
|   |-- docs/
|   |-- storage/
|   |-- tests/
|   |-- .env.example
|   |-- requirements.txt
|   `-- run.py
|
`-- mii/
    |-- app/
    |-- components/
    |-- lib/
    |-- public/
    |-- .env.example
    |-- .env.local
    |-- package.json
    `-- next.config.ts
```

---

## 4. Prerequisites

Install the following software before running the project:

- Python 3.10 or newer
- Node.js and npm
- Ollama
- Git

Verify the installations:

```bash
python --version
node --version
npm --version
ollama --version
```

---

## 5. Install Dependencies

### 5.1 Backend

Open a terminal in the repository root:

```bash
cd medical-ai-backend
```

Create a Python virtual environment.

**Windows PowerShell:**

```powershell
python -m venv .venv
.\.venv\Scripts\Activate.ps1
```

**Windows Command Prompt:**

```cmd
python -m venv .venv
.venv\Scripts\activate
```

Install the backend dependencies:

```bash
pip install -r requirements.txt
```

### 5.2 Frontend

Open another terminal:

```bash
cd mii
npm install
```

---

## 6. Configure the System

### 6.1 Backend Environment

Inside `medical-ai-backend`, create `.env` from `.env.example`.

**Command Prompt:**

```cmd
copy .env.example .env
```

**PowerShell:**

```powershell
Copy-Item .env.example .env
```

Configure the model and server settings. Use the variable names already provided by your `.env.example` file.

A typical configuration is:

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

### 6.2 Frontend Environment

Inside `mii`, configure `.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_USE_MOCK_API=false
```

Use the exact variable names expected by the current frontend code if they differ from the example above.

After changing environment variables, restart the Next.js development server.

---

## 7. Configure and Run Ollama

Pull the MedGemma model:

```bash
ollama pull medgemma1.5:4b
```

Verify that the model is installed:

```bash
ollama list
```

If Ollama is not already running, start the server:

```bash
ollama serve
```

The default Ollama server is:

```text
http://localhost:11434
```

---

## 8. Run the Backend

Open a terminal:

```bash
cd medical-ai-backend
```

Activate the virtual environment if it is not already active.

**PowerShell:**

```powershell
.\.venv\Scripts\Activate.ps1
```

Start FastAPI:

```bash
python -m uvicorn app.main:app --reload --port 8000
```

Backend URL:

```text
http://localhost:8000
```

FastAPI Swagger documentation:

```text
http://localhost:8000/docs
```

---

## 9. Run the Frontend

Open a new terminal:

```bash
cd mii
npm run dev
```

The frontend will normally be available at:

```text
http://localhost:3000
```

Open this address in a web browser.

---

## 10. Reproduce the Demonstrated Results

Use the following sequence to reproduce the demonstrated workflow.

### Step 1: Start Ollama

```bash
ollama list
```

Make sure `medgemma1.5:4b` is available.

If it is not available:

```bash
ollama pull medgemma1.5:4b
```

### Step 2: Start the Backend

```bash
cd medical-ai-backend
```

```bash
python -m uvicorn app.main:app --reload --port 8000
```

Check:

```text
http://localhost:8000/docs
```

### Step 3: Start the Frontend

In another terminal:

```bash
cd mii
npm run dev
```

Open:

```text
http://localhost:3000
```

### Step 4: Upload a Medical Image

Upload a supported medical image through the application interface.

### Step 5: Enter Patient Context

Enter the available information, such as:

- Patient age
- Patient sex
- Symptoms
- Clinical notes
- Test results

### Step 6: Run the Analysis

Submit the analysis request.

The frontend sends the image and clinical context to the FastAPI backend. The backend processes the input and communicates with MedGemma through Ollama.

### Step 7: Review the Result

Depending on the available model output and processing, the interface can display:

- Possible finding
- Confidence information
- Supporting evidence
- Clinical context
- Explanation
- Suspected location
- Bounding box
- Heatmap, when available
- Warnings and safety information

---

## 11. Confidence Threshold

The prototype uses a configurable confidence threshold to filter lower-confidence observations.

The current operating threshold is **70%**.

For example:

```text
AI Confidence = 95%
Threshold      = 70%

95% >= 70%
       |
       v
Finding passes the filter
```

If the confidence is below the threshold:

```text
AI Confidence = 65%
Threshold      = 70%

65% < 70%
       |
       v
Finding is below the threshold
```

### Important

A **70% threshold does not mean 70% diagnostic accuracy**. It is an operating/filtering threshold for the prototype.

For a clinically validated system, the threshold should be selected using labeled validation data and evaluated using metrics such as:

- Sensitivity
- Specificity
- Precision
- Recall
- False-negative rate
- ROC-AUC / PR-AUC where appropriate

---

## 12. API Endpoints

The backend provides REST endpoints for health checks, model status, and image analysis.

### Health Check

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

The analysis request uses multipart form data containing the medical image and available patient information.

Example fields may include:

```text
image
patient_age
patient_sex
symptoms
clinical_notes
test_results
```

### Annotated Image

```http
GET /api/v1/analysis/{id}/annotated-image
```

For the exact request and response contract, use the Swagger documentation:

```text
http://localhost:8000/docs
```

---

## 13. Evidence and Localization

The system is designed to process model output before presenting it to the user.

The workflow can include:

1. Image validation and preprocessing.
2. Structured prompting of the medical vision-language model.
3. Confidence validation.
4. Location validation.
5. Clinical-evidence checking.
6. Filtering or softening unsupported definitive statements.
7. Returning an insufficient-evidence state when reliable evidence is unavailable.

### Localization

The interface can visualize suspected regions using:

- Bounding boxes
- Optional heatmaps

These visualizations should be treated as **AI-assisted indications**, not as clinically validated detection or segmentation results.

---

## 14. Mock Mode

The project can be demonstrated without running the AI model by using mock responses, if supported by the current configuration.

### Frontend Mock Mode

```env
NEXT_PUBLIC_USE_MOCK_API=true
```

### Backend Mock Mode

```env
MOCK_MODEL=true
```

For the real MedGemma demonstration, use:

```env
NEXT_PUBLIC_USE_MOCK_API=false
MOCK_MODEL=false
```

and make sure Ollama and MedGemma are running.

---

## 15. Testing

Run the backend test suite:

```bash
cd medical-ai-backend
python -m pytest -q
```

Tests can cover areas such as:

- Health endpoint
- Model availability
- Invalid images
- Corrupt images
- Oversized images
- Unsupported image formats
- Missing request fields
- Mock responses
- Invalid model responses
- Timeout handling
- Schema validation
- Confidence validation
- Location validation
- Evidence rules
- Image endpoints
- CORS configuration

---

## 16. Applications in the Medical Industry

### 16.1 Radiology Assistance

Assist radiologists by highlighting suspicious regions and providing AI-assisted explanations for medical images.

### 16.2 Brain MRI and CT Analysis

Assist clinicians in reviewing suspicious regions in brain imaging and directing attention to areas requiring further assessment.

### 16.3 Chest X-ray Screening

Support preliminary screening workflows by analyzing chest X-ray images together with relevant patient symptoms and clinical information.

### 16.4 Clinical Decision Support

Combine:

```text
Medical Image
      +
Patient Information
      +
Clinical Notes
      +
Test Results
      |
      v
AI-Assisted Analysis
```

This provides image-based and context-based information in a single interface.

### 16.5 Emergency Case Prioritization

The system could potentially help prioritize suspicious cases for earlier human review in high-volume clinical environments.

### 16.6 Telemedicine

Support remote medical-image review when specialist interpretation is not immediately available.

### 16.7 Medical Research

Provide a platform for experimenting with multimodal medical-image analysis, evidence visualization, and AI-assisted clinical workflows.

### 16.8 Medical Education

Help medical students and trainees study medical images using visual evidence and AI-generated explanations.

---

## 17. Limitations

This project is a prototype and has important limitations:

- It is not clinically validated.
- It is not a certified medical device.
- MedGemma is used as a pretrained model.
- Model-generated confidence should not automatically be treated as a calibrated probability.
- AI-generated localization is not equivalent to validated medical-image detection or segmentation.
- False positives and false negatives are possible.
- Absence of an AI finding does not exclude disease.
- The current system is not a complete hospital imaging infrastructure.
- Real-world deployment would require authentication, encryption, access control, audit logging, data-retention policies, clinical validation, and regulatory compliance.
- Results must be reviewed by a qualified healthcare professional.

---

## 18. Future Enhancements

Future development can include:

- Specialized medical-image detection models.
- Segmentation models for precise lesion boundaries.
- Calibrated confidence estimation.
- DICOM support.
- Multi-slice CT/MRI support.
- Clinical validation datasets.
- Sensitivity, specificity, ROC-AUC, and PR-AUC evaluation.
- External validation across datasets and hospitals.
- Improved low-quality image handling.
- Authentication and role-based access control.
- Encryption and secure medical-data storage.
- Audit logging.
- Integration with hospital information systems or PACS where appropriate.

---

## 19. Project Contribution

The project does not train a new medical foundation model from scratch.

The main contribution is the integration of multiple components into a single multimodal workflow:

```text
Medical Image
      +
Patient Clinical Context
      +
MedGemma 1.5 4B
      +
Evidence Processing
      +
Localization
      +
Confidence Filtering
      +
Clinician-facing Visualization
```

This creates an integrated AI-assisted medical-image review workflow rather than a simple image-classification application.

---

## 20. Safety Disclaimer

> **This system is an AI-assisted clinical decision-support prototype. It is not a replacement for a qualified medical professional. AI-generated findings may be incorrect and must be reviewed by an appropriately qualified healthcare professional. The system is not intended to provide a standalone diagnosis or treatment decision.**
#   M u l t i m o d a l - M e d i c a l - I m a g e - I n t e l l i g e n c e  
 