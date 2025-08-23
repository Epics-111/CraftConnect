FROM python:3.10

WORKDIR /app

# Install dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Ensure gunicorn is available if not listed in requirements
RUN pip install --no-cache-dir gunicorn

# Copy source
COPY . .

EXPOSE 5000

HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
  CMD curl -f http://127.0.0.1:${PORT}/health || exit 1

# Use shell form so ${PORT} expands; default to single worker in case you run scheduler in-process
CMD sh -c "gunicorn --workers ${GUNICORN_WORKERS:-1} --bind 0.0.0.0:${PORT:-5000} app:app"