'''
MovieLens 에서 제공해주는 데이터 중에서
ratings.csv, movies.csv 를 전처리 합니다.
전처리 후 preprocessed.csv, mean_centered_ratings.csv 파일을 얻습니다.

[preprocessed.csv]  {movieid}|{title}|{released_year}|{gvector}
[mean_centered_ratings.csv]  (movieId:rating) ...
'''
import os
current_directory = os.path.dirname(os.path.dirname(__file__))
file_path = os.path.join(current_directory, 'downloads/ml-latest/movies.csv')
file_path_ratings = os.path.join(current_directory, 'downloads/ml-latest/ratings.csv')


def createGvector(s):
    genres = ["Action","Adventure" ,"Animation" ,"Children\'s" ,"Comedy","Crime","Documentary","Drama","Fantasy","Film-Noir","Horror","Musical","Mystery","Romance","Sci-Fi","Thriller","War","Western"]
    s = s.split('|')
    gvector= ['0'] * len(genres)
    for g in s:
        if g in genres:
            gvector[genres.index(g)] = "1"
    return gvector


with open(file_path, 'r', encoding = 'utf-8') as m :
    m.readline() # 헤더 읽기
    for line in m:
        line = line.strip()
        line = line.split(',')
        movieid = int(line[0])
        genres = line[-1]
        gvector = createGvector(genres)
        gvector = ''.join(gvector)

        line = line[1:-1]
        line = ','.join(line)
        line = line.replace('\"','')
        if ", The" in line:
            line = line.replace(', The',"")
            line = "The "+line
        year = line[-5:-1]
        if (')' in year ):
            year = line[-6:-2]
        title = line[:-7]
        with open('preprocessed.csv', 'a', encoding='utf-8') as w:
            w.write(f'{movieid}|{title}|{year}|{gvector}\n')


with open(file_path_ratings, 'r') as r :
    ratings = {}
    r.readline() # 헤더 읽기
    
    for line in r:
        line = line.strip()
        if line:
            fields = line.split(',')
            if len(fields) >= 3:
                userId = fields[0]
                movieId = fields[1]
                rating = fields[2]
                #timestamp = line[3]
                if userId in ratings:  
                    ratings[userId].append([movieId, rating])
                else : 
                    ratings[userId] = []
                    ratings[userId].append([movieId, rating])
            else:
                print(f"Skipping line: {line} (insufficient fields)")
        else:
            print("Skipping empty line")

with open('mean_centered_ratings.csv', 'w') as note:
    for key in ratings:
        sum = 0
        for r in ratings[key]:
            sum += float(r[1])
        avg = sum / len(ratings[key])
        for i, r in enumerate(ratings[key]):
            r[1] = str(round(float(r[1]) - avg,3))
            ratings[key][i] = r[0] + ":" + r[1]
        l = ','.join(ratings[key])
        note.write(l+'\n')
    