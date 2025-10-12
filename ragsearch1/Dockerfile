# RAGSearch1 API Dockerfile
# Multi-stage build for optimal image size

# ====================
# Stage 1: Builder
# ====================
FROM python:3.11-slim as builder

# Set working directory
WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    build-essential \
    curl \
    git \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements
COPY requirements.txt .

# Install Python dependencies
RUN pip install --no-cache-dir --upgrade pip && \
    pip install --no-cache-dir -r requirements.txt

# ====================
# Stage 2: Runtime
# ====================
FROM python:3.11-slim

# Set working directory
WORKDIR /app

# Install runtime dependencies only
RUN apt-get update && apt-get install -y \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Copy Python packages from builder
COPY --from=builder /usr/local/lib/python3.11/site-packages /usr/local/lib/python3.11/site-packages
COPY --from=builder /usr/local/bin /usr/local/bin

# Copy application code
COPY ragsearch1/ /app/ragsearch1/
COPY api/ /app/api/

# Create directories for logs and data
RUN mkdir -p /var/log/ragsearch1 /data/chromadb

# Create non-root user for security
RUN useradd -m -u 1000 ragsearch1 && \
    chown -R ragsearch1:ragsearch1 /app /var/log/ragsearch1 /data

# Switch to non-root user
USER ragsearch1

# Expose API port
EXPOSE 8000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
    CMD curl -f http://localhost:8000/health || exit 1

# Run the application
CMD ["uvicorn", "api.main:app", "--host", "0.0.0.0", "--port", "8000"]
