---
layout: page
title: Parallel Computing, with applications in Quantitative Strategies
description: Anastasia Papadopoulou, Kozak Hou, William Noh
img: assets/img/CCON.png
importance: 4
permalink: projects/parallel-computing-with-applications-in-quantitative-strategies/
---

<br>

# Parallel Computing, with applications in Quantitative Strategies

In the initial phase, we verify the installation of all required files. Following that, we conduct an in-depth analysis by applying multicore processing to a Volatility Momentum Equity Strategy. Finally, we conduct performance benchmarking using different numbers of CPU cores.

<br>

### Installation Process
#### SSH to your cluster as `student`

```
ssh student@hpcc-cluster-[]
```

Download the max historical data csv files for AGG and SPY, along with the 60/40 python file from the me344 cluster. Here is the command to obtain them:

```
scp -r [sunetid]@me344.stanford.edu:/opt/ohpc/pub/me344/project-3 .
```


**Data Collection and Preparation**:
Download daily data for the S&P 500 companies from Yahoo Finance, specifically focusing on "High," "Low," and "Close" prices for the period spanning from 2013-01-01 to 2023-01-01. Perform data cleaning, excluding stocks listed after the start date to match our training period. Save the refined dataset as a CSV file.

**Data Transfer to HPC Cluster**:
Copy the directory named "data" containing various files of historical equity data (obtained from the previous step) from your local computer to the HPC cluster. The destination path on the cluster should be "/home/student/data".
Alternatively, you may simply upload the files by browsing within Jupyter and slecting the "Upload" option.

```
scp -r data student@hpcc-cluster-1:
```

Change to the project-3 directory

```
cd project-3
```

The procedures are the same as the beginning of Project 3, except for "Install QSTrader and Jupyter as the student user" and there is no need to download the 60/40 python file.


Install QSTrader, YFinance and Jupyter as the student user

```
python3 -m venv backtest
source backtest/bin/activate
pip install --upgrade pip
pip install qstrader
pip install notebook==6.1.5
pip install jupyter_contrib_nbextensions
jupyter contrib nbextension install --user
pip install nglview
jupyter nbextension enable --py widgetsnbextension --user
jupyter nbextension enable nglview --py –user
pip install yfinance
pip install concurrent
pip install multiprocessing
pip install statistics
pip install pandas
pip install matplotlib
```

Create a Slurm script to launch Jupyter Notebook on compute-1-1. Make you are in the `$HOME/project-3` directory (command to execute is `pwd`). Name the script `jupyter_submit.slurm`:

```
#!/bin/bash
#SBATCH --job-name="Jupyter"                # Job name
#SBATCH --mail-user=[sunetid]@stanford.edu  # Email address    
#SBATCH --mail-type=NONE                    # Mail notification type (NONE, BEGIN, END, FAIL, ALL)
#SBATCH --partition=normal                  # Node partition
#SBATCH --nodes=1                           # Number of nodes requested
#SBATCH --ntasks=1                          # Number of processes
#SBATCH --time=01:00:00                     # Time limit request

source ~/project-3/backtest/bin/activate
EXEC_DIR=$HOME/project-3
hostname && jupyter-notebook --no-browser --notebook-dir=$EXEC_DIR
```

Use the ```sbatch``` command to submit the jupyter script to Slurm (you used it in previous labs). Because you are running a Jupyter notebook, you need to collect the URL in order to connect via a web browser. Using the following command, you can obtain the URL from the Slurm job output file:

```
egrep -w 'compute|localhost'  slurm-*.out
```

The output will look something like this:

```
...
slurm-103.out:compute-1-1
slurm-103.out:[I 18:40:29.846 NotebookApp] http://localhost:8888/?token=c11be5afa5cddd73548d8ff73786291202a37868d5c18451
slurm-103.out:        http://localhost:8888/?token=c11be5afa5cddd73548d8ff73786291202a37868d5c18451
```

In the example the URL to copy is `http://localhost:8888/?token=c11be5afa5cddd73548d8ff73786291202a37868d5c18451`.

You can't directly access the URL being hosted on your cluster, so you need to use SSH local port forwarding:

The following is an example of local port forwarding to interact with the Jupyter notebook hosted on compute-1-1 on your cluster (you are going to need to open a new terminal window to run this):

```
ssh -L 8888:localhost:8888 student@hpcc-cluster-[C] -t ssh -L 8888:localhost:8888 compute-1-1
```

Upon successful completion of the preceding command your prompt will show that you're on compute-1-1 as the student user. You can now enter the URL we noted earlier into your computer's web browser, launching a Juypter Notebook.

Note that due to the inability to establish an external network connection from the Stanford-HPCC computing node, the data source needs to be downloaded as a CSV format from localhost and then uploaded. In the submitted code report, instructions on how to download data using the yfinance API are provided.

Additionally, write a program to perform Monte Carlo backtesting and name it MCtask.py.

P.S. You can use the "Upload" button at the upper right corner of the Jupyter Notebook's homepage to upload data from localhost to your assigned cluster.

MCtask.py
```python
import math
import statistics
import numpy as np
import pandas as pd

def convertToRank(lst):
    #print (lst)
    arr = np.array(lst)
    order = arr.argsort()
    ranks = order.argsort()
    #print ("RANK: ", ranks)
    return ranks

def allocation(pvr, hvr, prr):
    pvr = convertToRank(pvr)
    hvr = convertToRank(hvr)
    prr = convertToRank(prr)
    weights = (pvr+hvr)*prr
    #print (pvr)
    #print (hvr)
    #print (prr)
    #print (weights)
    weights = weights / sum(weights)
    return weights
    
def MCbacktest(args):
    closeData, highData, lowData, thisCore, totalCore = args
    initial=100000
    dateResult = []
    returnResult = []
    for i in range(121+(thisCore-1)*2414//totalCore, 121+(thisCore)*2414//totalCore): #2535
        # 121~321, ~ , 2321~2521
        parkVolatility = [0]*40
        histVolatility = [0]*40
        prices = [0]*40
        for stock in range(40):
            prices[stock] = (-1)*(closeData[str(stock)][i])
            pSum = 0
            hArray = []
            for j in range(i-120, i):
                pSum += (math.log(highData[str(stock)][j]/lowData[str(stock)][j]))**2
                hArray.append(math.log(closeData[str(stock)][j]/closeData[str(stock)][j-1]))
            parkVolatility[stock] = math.sqrt(pSum/(4*120*math.log(2)))
            histVolatility[stock] = statistics.stdev(hArray)
        weights = allocation(parkVolatility, histVolatility, prices)
        #print (weights)
        nextday = 0
        for stock in range(40):
            nextday += initial * weights[stock] * closeData[str(stock)][i+1] / closeData[str(stock)][i]
        dateResult.append(closeData.index[i])
        returnResult.append(nextday/initial)
        initial = nextday
    return pd.DataFrame({"Date":dateResult, "Equity":returnResult})

Create a new Python 3 notebook and navigate to it.
Main File
import yfinance as yf
import pandas as pd
import matplotlib.pyplot as plt
import numpy as np
import json
import math
import statistics
from qstrader.statistics.tearsheet import TearsheetStatistics
from concurrent.futures import ProcessPoolExecutor
import time
from multiprocessing import Pool
from itertools import repeat
import MCtask
```

```
sd='2013-01-01'
ed='2023-01-31'
stocks = ["AAPL", "MSFT", "GOOG", "GOOGL", "AMZN", "PCAR", "BRK-A", "NVDA", "BRK-B", "TSLA", "META", "TSM", "V", "XOM", "UNH", "JNJ", "WMT", "JPM", "NVO", "PG", "MA", "LLY", "CVX", "HD", "ABBV", "MRK", "KO", "AVGO", "ASML", "ORCL", "PEP", "PFE", "BAC", "TMO", "COST", "AZN", "CSCO", "SHEL", "MCD", "CRM", "NVS", "TM", "NKE", "DIS"]
# Rank 30 Alibaba (BABA) is removed. (data starts from 2015) 
print (len(stocks))
```

```python
def getData(key, n=40): # key = High, Low, Close
    if n<2: return "ERROR_1"
    result = pd.DataFrame(yf.download(stocks[0], sd, ed)[key]).rename(columns={"Date":"Date",key:str(0)})
    for i in range(1,n):
        temp = pd.DataFrame(yf.download(stocks[i], sd, ed)[key]).rename(columns={"Data":"Date",key:str(i)})
        result = pd.concat([result, temp], axis=1)
    return result
```

```python
# highData = getData("High")
# lowData = getData("Low")
# closeData = getData("Close")

# highData.to_csv('highData.csv')
# lowData.to_csv('lowData.csv')
# closeData.to_csv('closeData.csv')

#------------------------------------------------------------------------------------------#
# Since the computing node cannot access to external internet through yfinance's API
# We download highData, lowData, and closeData at localhost then upload to hpcc-cluser

highData = pd.read_csv('highData.csv')
lowData = pd.read_csv('lowData.csv')
closeData = pd.read_csv('closeData.csv')

# transform Date's data type to datetime type 
highData['Date'] = pd.to_datetime(highData['Date'])
lowData['Date'] = pd.to_datetime(lowData['Date'])
closeData['Date'] = pd.to_datetime(closeData['Date'])

# transform the Date column to index
highData.set_index('Date', inplace=True)
lowData.set_index('Date', inplace=True)
closeData.set_index('Date', inplace=True)
```

```python
len(highData), len(lowData), len(closeData)
# The output should be: (2537, 2537, 2537) 
```

```python
import os
max_cores = os.cpu_count()

if __name__ ==  '__main__': 
    ################# CHANGE CORES HERE #################
    num_cores = max_cores
    ################# CHANGE CORES HERE #################
    
    core_num = [1, 2, 4, 8, 12, 16, 20, 24, 28, max_cores]
    time_taken = []
    
    for num_cores in core_num:
        start = time.time()
        with Pool(processes = num_cores) as p:
            BTresult = p.map(MCtask.MCbacktest, [(closeData, highData, lowData, core, num_cores) for core in range(1, num_cores+1)])
        end = time.time()
        time_taken.append(end - start)
        print(f"UTILIZING {num_cores} CORE(S) : TOOK {end - start:.5f} SEC")
        
        plt.bar(core_num, time_taken) 
        plt.xlabel('Number of Cores')
        plt.ylabel('Time Taken (sec)')
        plt.title('Time Taken vs Number of Cores')
        plt.show()
```

```python
BackTestResult = BTresult[0]
for i in range(1, len(BTresult)):
    BackTestResult = pd.concat([BackTestResult, BTresult[i]])
FinalResult = BackTestResult.copy()
FinalResult = FinalResult.set_index("Date")
initial = 1000000
for i in range(len(FinalResult)):
    new = initial * FinalResult["Equity"][i]
    FinalResult["Equity"][i] = new
    initial = new
```

```python
tearsheet = TearsheetStatistics(strategy_equity=FinalResult, title='volatilityMomentum Alpha Strategy')
tearsheet.plot_results()
```

<div class="row justify-content-sm-center">
    <div class="col-sm-10 mt-5 mt-md-0">
        {% include figure.liquid loading="eager" path="assets/img/hpccc.png" title="example image" class="img-fluid rounded z-depth-1" %}
    </div>
</div>


In this way, we have implemented Parallel Computing for the Volatility Momentum Equity Strategy and conducted benchamrking analysis for varying numbers of CPU cores.  

#### **Terminating Jupyter**

To stop local port forwarding on your computer, go to the terminal window where you entered the command enter `exit` a few times to end all sessions.

To stop the Jupyter instance from running, run `squeue` on the cluster to see the jobs running. You will see output resembling this:


```
JOBID PARTITION     NAME     USER ST       TIME  NODES NODELIST(REASON)
105    normal  Jupyter  [user]  R       7:08      1 compute-1-1
```
