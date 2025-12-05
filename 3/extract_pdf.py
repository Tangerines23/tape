#!/usr/bin/env python
# -*- coding: utf-8 -*-
import sys
import os

try:
    import pdfplumber
    pdf_path = os.path.join(os.path.dirname(__file__), 'images', 'taping_qc.pdf')
    with pdfplumber.open(pdf_path) as pdf:
        for i, page in enumerate(pdf.pages):
            print(f"=== Page {i+1} ===")
            text = page.extract_text()
            if text:
                print(text)
            print("\n")
except ImportError:
    print("pdfplumber is not installed. Installing...")
    import subprocess
    subprocess.check_call([sys.executable, "-m", "pip", "install", "pdfplumber", "--quiet"])
    import pdfplumber
    pdf_path = os.path.join(os.path.dirname(__file__), 'images', 'taping_qc.pdf')
    with pdfplumber.open(pdf_path) as pdf:
        for i, page in enumerate(pdf.pages):
            print(f"=== Page {i+1} ===")
            text = page.extract_text()
            if text:
                print(text)
            print("\n")
except Exception as e:
    print(f"Error: {e}")

