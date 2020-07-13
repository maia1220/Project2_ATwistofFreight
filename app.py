

import sqlite3
from sqlalchemy import create_engine
import pandas as pd
from flask import Flask, render_template, jsonify
from pprint import pprint

# create instance of Flask app
app = Flask(__name__)


@app.route("/")
def index():

    return (
        f"Welcome!<br/>"
        f"Available Routes:<br/>"
        f"P1: /output1<br/>"
        # f"P2: /output2<br/>"
        f"P6: /output6<br/>"
        f"Freight States: /outputF<br/>"
        f"Dashboard Webpage: /html<br/>"
    )
    

@app.route("/output1")
def output1():
    database_path = "output.new.sqlite"
    # Create an engine that can talk to the database
    engine = create_engine(f"sqlite:///{database_path}")
    conn = engine.connect()

    # Query All Records in the the Database
    df1 = pd.read_sql("SELECT * FROM 'CFSPRELIM2017.CF1700P1'", conn)

    for column in df1:
      df1[column].replace(to_replace=["S", "Z"], value= "0", inplace=True)
    
    data1 = df1.to_dict()

    api_data1 = []
    for column, data in data1.items():
        values =  [x for x in data.values()]
        for i in range(len(values)):
            try:
                api_data1[i][column] = values[i]
            except:
                api_data1.append({column:values[i]})
   
    return jsonify(api_data1)


@app.route("/output6")
def output6():
    database_path = "output.new.sqlite"
    # Create an engine that can talk to the database
    engine = create_engine(f"sqlite:///{database_path}")
    conn = engine.connect()

    # Query All Records in the the Database
    df6 = pd.read_sql("SELECT * FROM 'CFSPRELIM2017.CF1700P6'", conn)

    for column in df6:
      df6[column].replace(to_replace=["S", "Z"], value= "0", inplace=True)
    
    data6 = df6.to_dict()

    api_data6 = []
    for column, data in data6.items():
        values =  [x for x in data.values()]
        for i in range(len(values)):
            try:
                api_data6[i][column] = values[i]
            except:
                api_data6.append({column:values[i]})
   
    return jsonify(api_data6)
 

@app.route("/outputF")
def outputF():
    database_path = "output.new.sqlite"
    # Create an engine that can talk to the database
    engine = create_engine(f"sqlite:///{database_path}")
    conn = engine.connect()

    # Query All Records in the the Database
    dfF = pd.read_sql("SELECT * FROM 'FreightStates'", conn)
    
    for column in dfF:
      dfF[column].replace(to_replace=["S", "Z"], value= "0", inplace=True)
    
    dataF = dfF.to_dict()

    api_dataF = []
    for column, data in dataF.items():
        values =  [x for x in data.values()]
        for i in range(len(values)):
            try:
                api_dataF[i][column] = values[i]
            except:
                api_dataF.append({column:values[i]})
   
    return jsonify(api_dataF)

@app.route("/html")
def html():

    return render_template('index.html')

@app.route("/view1")
def v1():

    return render_template('view1.html')

@app.route("/view2")
def v2():

    return render_template('view2.html')

@app.route("/view3")
def v3():

    return render_template('view3.html')

@app.route("/view4")
def v4():

    return render_template('view4.html')


if __name__ == "__main__":
    app.run(debug=True)

