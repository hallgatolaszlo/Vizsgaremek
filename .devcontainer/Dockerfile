FROM node:20

# Install Python and pip
RUN apt-get update && \
    apt-get install -y python3 python3-pip python3-venv openssh-client git && \
    apt-get clean && rm -rf /var/lib/apt/lists/*

# Set working directory
WORKDIR /workspace

# Set up virtual environment
RUN python3 -m venv /opt/venv

# Use it for pip installs
ENV PATH="/opt/venv/bin:$PATH"

# Optional: pre-install Python or Node dependencies
COPY backend/requirements.txt ./backend/
RUN pip install -r ./backend/requirements.txt

COPY frontend/package.json ./frontend/
RUN cd frontend && npm install

# Create .ssh directory for root
RUN mkdir -p /root/.ssh && chmod 700 /root/.ssh