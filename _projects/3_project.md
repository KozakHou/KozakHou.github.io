---
layout: page
title: High Performance Computing with NVIDIA-RAPIDS
description: Kozak Hou
img: assets/img/EMNIST.png
importance: 3
---
## Problem Statement

The goal of this project is to implement a high performance computing (HPC) application using NVIDIA-RAPIDS. The dataset used for this project are the EMNIST dataset and the hyperscan data from Japanese satellite, HIMAWARI -8. The application will be implemented using Python and the RAPIDS library, which is a collection of GPU-accelerated data science libraries.

<br>

## NVIDIA-RAPIDS

RAPIDS is a suite of open-source software libraries and APIs built on CUDA that allows end-to-end data science and analytics pipelines entirely on GPUs. It is designed to be a drop-in replacement for the most popular data science libraries, such as Pandas, Scikit-learn, and Numpy. The code below shows how to import the RAPIDS libraries from CPU-based packages to GPU-based packages. you can find more information about RAPIDS [here](https://rapids.ai/).

```python
import pandas as df 
import cudf # CUDA-DATAFRAME

pd.read_csv('...')
cudf.read_csv('...')


import numpy as np
import cupy as cp # CUDA-ARRAY

np.array([1, 2, 3])
cp.array([1, 2, 3])

from sklearn.ensemble import RandomForestClassifier as skRF 
from cuml.ensemble import RandomForestClassifier as cumlRF # CUDA-RANDOM-FOREST

skRF()
cumlRF()
```

<br>

## EMNIST Dataset

The EMNIST dataset is a set of handwritten character digits derived from the NIST Special Database 19 and converted to a 28x28 pixel image format and dataset structure that directly matches the MNIST dataset. The EMNIST dataset is split into two sets: the EMNIST ByClass and the EMNIST ByMerge. The EMNIST ByClass dataset is a set of characters with 814,255 labeled examples. The EMNIST ByMerge dataset is a set of characters with 814,255 labeled examples. The code below shows how to load the EMNIST dataset using the RAPIDS library.

```python
import cudf
import cupy as cp

from cuml.datasets import fetch_openml

emnist = fetch_openml(name='EMNIST_Balanced')
X, y = emnist.data, emnist.target
```

<br>

<div class="row justify-content-sm-center">
    <div class="col-sm-8 mt-5 mt-md-0">
        {% include figure.liquid loading="eager" path="assets/img/emnist_demo.png" title="example image" class="img-fluid rounded z-depth-1" %}
    </div>
</div>
<div class="caption">
    <p>EMNIST dataset</p>
</div>

<br>

## Hyperscan Data

The hyperscan data from the Japanese satellite, HIMAWARI-8, is a set of images with 16 labeled classes (9 were used in this project). The hyperscan data is used to analysis the weather conditions in Japan and Taiwan such as lonitude, latitude, temperature, humidity, precipitation, and etc. It provides a high-resolution image (2 x 2  $${km}^2$$) of the Earth's surface every 10 minutes.


> ##### Reminder
>
> This project won't be able to provide the hyperscan data from the Japanese satellite, HIMAWARI-8, since it is a proprietary data needed to be authorized by JAXA (Japan Aerospace Exploration Agency). The results demonstrating in this project are dedicating to present the time consumption and performance of the RAPIDS library.
{: .block-warning }

<br>

## Results

#### **EMNIST Dataset**

For the EMNIST dataset, I only tested it whether it can be trained by scikit-learn and cuml, and used SVM as the classifier. However, after serveral attempts, I found that <font color="#f00">the scikit-learn is not able to train the EMNIST dataset</font>. Therefore, the only results presented for the EMNIST dataset are implemented using cuml.SVM() below. For detailed implementation, you can find it [here](https://github.com/KozakHou/cuDF-and-cuML/blob/main/MNIST_EMNIST.ipynb)

<div class="row justify-content-sm-center">
    <div class="col-sm-8 mt-5 mt-md-0">
        {% include figure.liquid loading="eager" path="assets/img/rapids_emnist.png" title="example image" class="img-fluid rounded z-depth-1" %}
    </div>
</div>
<div class="caption">
    <p>Time Consumption for EMNIST with RAPIDS</p>
</div>

<br>

#### **Hyperscan Data**

The results for discussing the HyperScan data are divided into two parts: CPU-based and GPU-based. The CPU-based results are implemented using the Pandas, Numpy, and Scikit-learn libraries. The GPU-based results are implemented using the RAPIDS library. In this project, I personally tested the results from the following CPU and GPU with no parallelism and no optimization.

- CPU:

  - Intel Core Xeon(R) CPU Gold 6334 @ 3.60GHz - (Scikit-learn)
  - Intel Core Xeon(R) CPU Platinum 8280 @ 2.70GHz - (Scikit-learn)
  - Intel Core i7-9750H CPU @ 2.60GHz - (Scikit-learn)
  - AMD Ryzen 7 4800H with Radeon Graphics @ 3.00GHz - (Scikit-learn)
  - AMD Ryzen 7 4800HS with Radeon Graphics @ 3.00GHz - (Scikit-learn)
- GPU:

  - NVIDIA GeForce GTX 1660 Ti Laptop GPU - (RAPIDS)
  - NVIDIA GeForce RTX 3070 Ti Laptop GPU - (RAPIDS)
  - NVIDIA GeForce RTX Quadro 5000 - (RAPIDS)
  - NVIDIA A100-SXM4-40GB - (RAPIDS)
- Apple M1 - (Scikit-learn only)

The results are shown in the table below (Trained by Random Forest Regressor (default setting)).

<div class="row justify-content-sm-center">
    <div class="col-sm-12 mt-4 mt-md-0">
        {% include figure.liquid loading="eager" path="assets/img/rapids_hpc.png" title="example image" class="img-fluid rounded z-depth-1" %}
    </div>
</div>
<div class="caption">
    <p>Time Consumption for training Himawari-8 dataset</p>
</div>

<br>

It is evidently that the RAPIDS shows a significant improvement in the time consumption compared to the CPU-based libraries. Inarguably, the A100-SXM4-40GB GPU is the best performer in this project. In addition, we can see that AMD Ryzen 7 4800HS has slightly better performance than AMD Ryzen 7 4800H, which is due to the higher clock speed. The Apple M1 is also tested in this project, but it is not able to run the RAPIDS lirary.

**The results are not optimized and parallelized, and the performance may vary in different environments.**

<br>

## References

- [RAPIDS](https://rapids.ai/)
- [EMNIST](https://www.nist.gov/itl/iad/image-group/emnist-dataset)
- [HIMAWARI-8](https://www.data.jma.go.jp/mscweb/en/himawari89/)
- [JAXA](https://www.jaxa.jp/)
