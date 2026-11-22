# Create venv

python3 -m venv .venv
source /home/bossnare/dev/trimly/rembg-server/.venv/bin/activate
python -m pip install --upgrade pip

## load and download ONNX models

`python` python -c "from rembg import new_session;new_session('isnet-general-use');print('sucessfully downloaded.')"
