import json
import sys

def load(file: str):
    with open(file, "r") as f:
        return json.load(f)


def merge_data(dir: str):
    data = ['spec', 'lines', 'full', 'single']

    return { d: load(f'{dir}/{d}.json') for d in data }


def main():
    if len(sys.argv) != 2:
        print('usage: python svg.py <area:Taipei|Kaohsiung|Taichung>')
        return

    area = sys.argv[1]

    data = merge_data(dir = f'../{area}/data')
    raw = json.dumps(data).replace(' ', '').replace('\n', '')

    with open(f'../{area}/{area.lower()}.json', 'w') as f:
        f.write(raw)


if __name__ == '__main__':
    main()