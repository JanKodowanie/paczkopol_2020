FROM python:3-slim
WORKDIR /src

COPY . .
RUN python3 -m pip install -r requirements.txt
CMD ["python3", "app.py"]