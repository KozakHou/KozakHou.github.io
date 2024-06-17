---
layout: page
title: Automatic Emergency Dust-Free solution on-board International Space Station with Bi-GRU
description: Kozak Hou, Wei-Chih Lin, Hong-Chun Hou, Yu-Hao Huang, Jih-Hong Shue
img: assets/img/AED.jpg
importance: 5
---
<br>

## Abstract

With a rising attention for the issue of PM2.5 or PM0.3, particulate matters have become not only a potential threat to both the environment and human, but also a harming existence to instruments onboard International Space Station (ISS). Our team is aiming to relate various concentration of particulate matters to magnetic fields, humidity, acceleration, temperature, pressure and CO2 concentration. Our goal is to establish an early warning system (EWS), which is able to forecast the levels of particulate matters and provides ample reaction time for astronauts to protect their instruments in some experiments or increase the accuracy of the measurements; In addition, the constructed model can be further developed into a prototype of a remote-sensing smoke alarm for applications related to fires. In this article, we will implement the Bi-GRU (Bidirectional Gated Recurrent Unit) algorithms that collect data for past 90 minutes and predict the levels of particulates which over 2.5 µm per 0.1 liter for the next 1 minute, which is classified as an early warning.

<br>

## Introduction

On December 21, 2021, ICE Cube's AI Box was launched aboard the well-known SpaceX CRS-24 rocket on its way to the International Space Station (ISS). This AI Box was equipped with a set of sensors to monitor various environmental factors and was integrated with the powerful edge computing system, Nvidia Jetson Xavier NX. The sensors inside the AI Box served different purposes. The SparkFun Atmospheric Sensor Breakout (BME280) was responsible for measuring ambient pressure, humidity, and temperature. The Adafruit PMSA003I Quality Breakout (PMSA) was tasked with measuring particulate concentration and number density. Lastly, the Adafruit SCD-30 – NDIR CO2 Temperature and Humidity Sensors (SCD) and the SparkFun 9DoF IMU Breakout (ICM-20948) were utilized for measuring acceleration and magnetic field, respectively. 


The workflow of the mission can be illustrated by the graph below.

<div class="row justify-content-sm-center">
    <div class="col-sm-5 mt-8 mt-md-0">
        {% include figure.liquid loading="eager" path="assets/img/workflow_aediss.png" title="example image" class="img-fluid rounded z-depth-1" %}
    </div>
</div>
<div class="caption">
    Example of the workflow of the mission.
</div>

<br>

## Objective

1. Predicting results is closed to the real numerical value.
2. The model shall be able to send warning signal if the PM 2.5 ‘s prediction over the threshold (35 $$\mu g/m^3$$)
3. The model shall be able to send warning signal if the PM 0.3 ‘s prediction over the threshold (102 $$\#/m^3$$) 
4. The model shall be retrained once a month to accommodate space variabilities.
5. The model can be used in environmental safety or in business.

<br>

## Implementation

The following graph is the Functional Flow Block Digram of the AI Box.

<div class="row justify-content-sm-center">
    <div class="col-sm-12 mt-5 mt-md-0">
        {% include figure.liquid loading="eager" path="assets/img/aediss.png" title="example image" class="img-fluid rounded z-depth-1" %}
    </div>
</div>
<div class="caption">
    Design of our AI Box
</div>

<br>

#### Implementation of Bi-GRU

**Features**: 3-Axis Acceleration, 3-Axis Magnetic Field, CO2 Concentration.

**Target**: PM2.5 [for human], PM0.3[for instruments]

**Model**: Bi-GRU

**Input**: Past 90 minutes data

**Output**: Next 1 minute data

#### **Bi-GRU**

Bi-GRU is a type of neural network that is suitable for sequential data. It is a type of Recurrent Neural Network (RNN) that is capable of learning long-term dependencies with following configuration : [**Forward GRU**, **Backward GRU**]. The following mathematical equations show how the Bi-GRU works:

$$
\begin{aligned}
\text{Forward GRU:} \quad & z_{t} = \sigma\left(W_{z} x_{t} + U_{z} h_{t-1} + b_{z}\right) \\
& r_{t} = \sigma\left(W_{r} x_{t} + U_{r} h_{t-1} + b_{r}\right) \\
& \tilde{h}_{t} = \tanh\left(W h_{t-1} + U\left(r_{t} \odot x_{t}\right) + b\right) \\
& h_{t} = z_{t} \odot h_{t-1} + (1 - z_{t}) \odot \tilde{h}_{t} \\
& \\
\text{Backward GRU:} \quad & z_{t} = \sigma\left(W_{z} x_{t} + U_{z} h_{t+1} + b_{z}\right) \\
& r_{t} = \sigma\left(W_{r} x_{t} + U_{r} h_{t+1} + b_{r}\right) \\
& \tilde{h}_{t} = \tanh\left(W h_{t+1} + U\left(r_{t} \odot x_{t}\right) + b\right) \\
& h_{t} = z_{t} \odot h_{t+1} + (1 - z_{t}) \odot \tilde{h}_{t}
\end{aligned}
$$

where $$x_{t}$$ is the input vector at time $$t$$, $$h_{t}$$ is the hidden state vector at time $$t$$, $$W_{z}$$, $$U_{z}$$, $$b_{z}$$, $$W_{r}$$, $$U_{r}$$, $$b_{r}$$, $$W$$, $$U$$, $$b$$ are the weight matrices and bias vectors, $$\sigma$$ is the sigmoid activation function, $$\tanh$$ is the hyperbolic tangent activation function, and $$\odot$$ is the element-wise multiplication.

<br>

## Results

The following graph shows the Model loss and prediction of PM0.3

<div class="row justify-content-sm-center">
    <div class="col-sm-5 mt-8 mt-md-0">
        {% include figure.liquid loading="eager" path="assets/img/aediss_loss.png" title="example image" class="img-fluid rounded z-depth-1" %}
    </div>
</div>
<div class="caption">
    Model loss
</div>


<div class="row justify-content-sm-center">
    <div class="col-sm-12 mt-5 mt-md-0">
        {% include figure.liquid loading="eager" path="assets/img/PM03.png" title="example image" class="img-fluid rounded z-depth-1" %}
    </div>
</div>
<div class="caption">
    Prediction of PM0.3
</div>

<div class="row justify-content-sm-center">
    <div class="col-sm-7 mt-8 mt-md-0">
        {% include figure.liquid loading="eager" path="assets/img/gru_bigru.png" title="example image" class="img-fluid rounded z-depth-1" %}
    </div>
</div>
<div class="caption">
    The RMSE of vanilla GRU and Bi-GRU
</div>

<br>

## Conclusion

In this project, we examined the feasibility of using Bi-GRU to predict the PM2.5 and PM0.3 concentration. The results show that the Bi-GRU model is able to predict the PM2.5 and PM0.3 concentration with a low RMSE. The model is able to send warning signal if the PM 2.5 ‘s prediction over the threshold (35 $$\mu g/m^3$$) and the PM 0.3 ‘s prediction over the threshold (102 $$\#/m^3$$). The model is retrained once a month to accommodate space variabilities to ensure the accuracy of the model acquired in the periodic space environment such as Solar Flare, Earth Rotation. In addition, we also discuss the difference between vanilla GRU and Bi-GRU, and the results show that the Bi-GRU model outperforms the vanilla GRU model in terms of RMSE.


<br>

## Acknowledgement
Major thanks to the AI Space Challenge committee for providing ICE Cube’s AI Box data, and awarding us the Best Technical Award in the challenge. Our team want to thank the CEO of Gran Systems, Ke-Kuang Han, and Professor of Taipei-Tech, Yang-Lang Chang for meaningful discussions and support. We gratefully appreciate Space Environment Laboratory, National Central University and Taipei-Tech for providing edge-computing system to simulate Nvidia Jetson Xavier NX onboard ISS. 

<br>

## References
- Urban DL, Cleary T, Yang J, Mulholland G, Yuan Z,Dust and Aerosol Measurement Feasibility Test [online], 2006. Space Station Research Explorer on NASA.gov. Available from: https://www.nasa.gov/mission_pages/station/research/experiments/explorer/Investigation.html?#id=246 
- Urban DL, Ruff GA, Yuan Z, Cleary T, Griffin DW, Yang J, Mulholland G, Detection of Smoke from Microgravity Fires, [2005 2005-01-293010], SAE Technical Paper. pp. DOI: 10.4271/2005-01-2930. DOI: 10.4271/2005-01-2930 | Impact Statement
- Ruff GA, Urban DL, King MK, A Research Plan for Fire Prevention, Detection, and Suppression in Crewed Exploration Systems, [2005 2005-341]. 43rd Aerospace Sciences Meeting and Exhibit, Reno, NV. | Impact Statement
- Wang, J., & Ogawa, S, [2015], Effects of Meteorological Conditions on PM2.5 Concentrations in Nagasaki, Japan. Basel, Switzerland: MDPI https://www.mdpi.com/1660-4601/12/8/9089[Accessed in 25 January 2022]
- Xiao-Ru Ni, Zhi-Yuan Wang, Jing-Rui Wang, Wan-Shui Yu, Shuai Chang, COMSOL 3D simulation study of the effect of metal particles on surface charge accumulation in DC GIL, 2017, COMSOL Technical Papers and Presentations. https://www.comsol.com/paper/gil-comsol-53803 [Accessed in 12 January 2022] 
- James L. Reuter and Richard P. Reysa, International Space Station Environmental Control and Life Support System Design Overview Update, 1997, SAE Transactions Vol. 106, Section 1 JOURNAL OF AEROSPACE (1997), pp.627-637(11 pages)
- Alex Azar, Is there an air quality standard for PM2.5 in outdoor air?, New York State Department of Health, 2018 ,Available from: https://www.health.ny.gov/environmental/indoors/air/pmq_a.htm [Accessed in 5 January 2022]
- PASSANT RABIE. NASA REVEALS HOW SOLAR CYCLE 25 WILL IMPACT LIVES AND TECHNOLOGY ON EARTH. INVERSE, 2020, Available from: https://www.inverse.com/science/solar-cycle-25-nasa-explains[Accessed in 27 January 2022]
- Cho, Kyunghyun; van Merrienboer, Bart; Bahdanau, DZmitry; Bengio, Yoshua, 2014,  "On the Properties of Neural Machine Translation: Encoder-Decoder Approaches". arXiv:1409.1259.
- Felix Gers; Jürgen Schmidhuber; Fred Cummins, [1999],"Learning to Forget: Continual Prediction with LSTM".,1999,  Proc. ICANN'99, IEE, London. 1999: 850–855. doi:10.1049/cp:19991218. ISBN 0-85296-721-7.
- "Recurrent Neural Network Tutorial, Part 4 – Implementing a GRU/LSTM RNN with Python and Theano – WildML", 2015, Wildml.com.. Retrieved May 18, 2016.
- Ravanelli, Mirco; Brakel, Philemon; Omologo, Maurizio; Bengio, Yoshua, 2018, "Light Gated Recurrent Units for Speech Recognition". IEEE Transactions on Emerging Topics in Computational Intelligence. 2 (2): 92–102. arXiv:1803.10225. doi:10.1109/TETCI.2017.2762739. S2CID 4402991
- Su, Yuahang; Kuo, Jay, 2019, "On extended long short-term memory and dependent bidirectional recurrent neural network". Neurocomputing. 356: 151–161. arXiv:1803.01686. doi:10.1016/j.neucom.2019.04.044. S2CID 3675055.
- Chung, Junyoung; Gulcehre, Caglar; Cho, KyungHyun; Bengio, Yoshua, 2014, "Empirical Evaluation of Gated Recurrent Neural Networks on Sequence Modeling". arXiv:1412.3555 [cs.NE].
- Gruber, N.; Jockisch, A. ,2020, "Are GRU cells more specific and LSTM cells more sensitive in motive classification of text?", Frontiers in Artificial Intelligence, 3: 40, doi:10.3389/frai.2020.00040, PMC 7861254, PMID 33733157, S2CID 220252321
- Chung, Junyoung; Gulcehre, Caglar; Cho, KyungHyun; Bengio, Yoshua, 2014,."Empirical Evaluation of Gated Recurrent Neural Networks on Sequence Modeling". arXiv:1412.3555 [cs.NE]
