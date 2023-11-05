import pickle
import numpy as np
import time
import datetime
import matplotlib.pyplot as plt
import os

current_directory = os.path.dirname(os.path.dirname(__file__))
file_path = os.path.join(current_directory, 'ml/preprocessed.csv')
file_path_ratings = os.path.join(current_directory, 'ml/mean_centered_ratings.csv')

def fappendline(filename, string):
    with open(filename, 'a') as f:
        f.write(string+'\n')

# const
numMovies= 86537
last_step = 0
BIAS = 0.01
EA_DENOMINATOR = 7
# variables
id_sparse = [0] # dense_id -> sparse_id
id_dense = {} # sparse_id -> dense_id
dict_item = {} # sparse_id -> movie_name
released= {}
gvector={}
encodings = {}


with open(file_path, 'r') as p :
    for idx , line in enumerate(p):
        line = line.strip()
        line = line.split('|')
        movie_id = int(line[0])
        dict_item[movie_id] = line[1].strip()
        try : released[movie_id] = int(line[2])
        except : 
            released[movie_id] = 1970 # 연도가 없는 데이터도 있습니다.
            print('YEAR ERR : ' + str(movie_id))
        gvector[movie_id] = np.array(list(map(int , line[3])))
        id_sparse.append(movie_id)
        id_dense[movie_id] = idx+1
        encodings[idx+1] = np.array([0] * (numMovies+1))
        encodings[idx+1][idx+1] = 1

'''
#load encodings
with open('encoded_10000.pickle', 'rb') as f:
    encodings = pickle.load(f)
'''
print(len(encodings))
print(encodings[1][:5], encodings[2][:5], encodings[3][:5])

# va
with open(file_path_ratings, 'r') as f:
    for idx, line in enumerate(f):
        current_step = idx+1
        if current_step <= last_step : 
            continue
        
        line = line.strip()
        user_ratings = line.split(',') 
        for rating_i in user_ratings:
            item_i = id_dense[int(rating_i.split(':')[0])]
            r_i = float(rating_i.split(':')[1]) + BIAS
            for rating_j in user_ratings:
                    item_j = id_dense[int(rating_j.split(':')[0])]
                    r_j = float(rating_j.split(':')[1]) + BIAS
                    relevance = np.dot(gvector[id_sparse[item_i]],gvector[id_sparse[item_j]])
                    if (item_i != item_j) and relevance != 0 :
                        if not (r_i < 0 and r_j < 0) : 
                            #sim = r_i*r_j
                            if released[id_sparse[item_j]] >= 2020 : ea = 1
                            else : ea = 1 + ((2020 - released[id_sparse[item_j]]) / EA_DENOMINATOR)
                            sim = relevance * r_j / ea
                            encodings[item_i] = encodings[item_i] + ((encodings[item_j] / np.linalg.norm(encodings[item_j])) * sim) 
        # history
        ut = time.time()
        dt = datetime.datetime.fromtimestamp( ut ).strftime('%Y-%m-%d %H:%M:%S')
        fappendline('history.txt', f'{current_step},{dt}\n')
        
        if current_step % 50000 == 0 :
            #process at savepoint
            #save
            with open(f'encoded_{current_step}.pickle', 'wb') as w:
                pickle.dump(encodings, w)
            print(current_step,dt)
            print(f'encoded_{current_step}.pickle successfully saved!')
