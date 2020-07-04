# @TODO: P6, replace Z with 0;
# P2: replace S or Z with 0,
# P1: replace S or Z with 0,


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
        f"P2: /output2<br/>"
        f"P6: /output6<br/>"
        f"Freight States: /outputF<br/>"
    )
    

@app.route("/output1")
def output1():
    database_path = "output.new.sqlite"
    # Create an engine that can talk to the database
    engine = create_engine(f"sqlite:///{database_path}")
    conn = engine.connect()

    # Query All Records in the the Database
    df1 = pd.read_sql("SELECT * FROM 'CFSPRELIM2017.CF1700P1'", conn)
    
    data1 = df1.to_dict()

    return data1


@app.route("/output2")
def output2():
    database_path = "output.new.sqlite"
    # Create an engine that can talk to the database
    engine = create_engine(f"sqlite:///{database_path}")
    conn = engine.connect()

    # Query All Records in the the Database
    df2 = pd.read_sql("SELECT * FROM 'CFSPRELIM2017.CF1700P2'", conn)
    
    data2 = df2.to_dict()

    return data2


@app.route("/output6")
def output6():
    database_path = "output.new.sqlite"
    # Create an engine that can talk to the database
    engine = create_engine(f"sqlite:///{database_path}")
    conn = engine.connect()

    # Query All Records in the the Database
    df6 = pd.read_sql("SELECT * FROM 'CFSPRELIM2017.CF1700P6'", conn)
    

    data6 = df6.to_dict()

    return data6
 

@app.route("/outputF")
def outputF():
    database_path = "output.new.sqlite"
    # Create an engine that can talk to the database
    engine = create_engine(f"sqlite:///{database_path}")
    conn = engine.connect()

    # Query All Records in the the Database
    dfF = pd.read_sql("SELECT * FROM 'FreightStates'", conn)
    

    dataF = dfF.to_dict()

    return dataF

if __name__ == "__main__":
    app.run(debug=True)





