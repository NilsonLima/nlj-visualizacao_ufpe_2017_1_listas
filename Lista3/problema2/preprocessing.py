import pandas as pd
import numpy as np

def main( ):
    with open("recife-dados-despesas-2015.csv", "r+", encoding='utf-8') as f:
        content = f.read()
        content = content.replace(",", ".")
        content = content.replace(";", ",")

    with open("recife-dados-despesas-2015.csv", "w", encoding='utf-8') as f:
        pass

    with open("recife-dados-despesas-2015.csv", "w", encoding='utf-8') as f:
        f.write(content)
        f.close( )

    return

if __name__ == '__main__':
    main( )
