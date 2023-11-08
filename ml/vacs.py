import pickle
import numpy as np
import time
import datetime
import matplotlib.pyplot as plt
import os
import sys
import heapq
import math

current_directory = os.path.dirname(os.path.dirname(__file__))
file_path = os.path.join(current_directory, 'ml/preprocessed.csv')
file_path_ratings = os.path.join(current_directory, 'ml/mean_centered_ratings.csv')

def fappendline(filename, string):
    with open(filename, 'a') as f:
        f.write(string+'\n')

def main() :
    # const
    numMovies= 86537
    last_step = 0
    BIAS = 0.01
    EA_DENOMINATOR = 7
    CRITS = sys.argv[1].split(',')

    #top_k
    k = 77 

    
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

            ##############################################################찍먹#################################################################
            if current_step % 25 == 0 :
                for c in CRITS : #c : movieID
                    print(c)
                    key_dense = id_dense[int(c)]
                    result = []
                    result_sims= []
                    top_k = []
                    sims = []
                    
                    print(f'encoding#{key_dense}')
                    t0 = time.time()
                    criteria_encoding = encodings[key_dense]
                    x = np.linalg.norm(criteria_encoding)

                    # 인코딩 벡터간의 코사인 거리 측정
                    for key in encodings:
                        if key != key_dense:
                            target_encoding = encodings[key][:]
                            mul = np.dot(criteria_encoding, target_encoding)
                            x = np.linalg.norm(criteria_encoding)
                            y = np.linalg.norm(target_encoding)
                            cos_sim = float(mul / (x*y))
                            sims.append((-cos_sim, id_sparse[key], y))
                            
                    # 코사인 유사도가 가장 큰 k 개의 아이템 추출
                    # heapify 
                    heapq.heapify(sims)
                    for i in range(k):
                        top_k.append(heapq.heappop(sims))

                    # k 개 중에서 절댓값 크기 순서로 15개 자르고, 장르 유사성으로 정렬
                    # heapify로 변경할 여지가 있습니다.
                    top_k.sort(key = lambda x : x[2]) # x[2] = np.linalg.norm(target_encoding)
                    top_k = top_k[-15:]
                    print('movie#' + c)
                    top_k.sort(key = lambda x : np.dot(gvector[x[1]], gvector[int(c)]), reverse = True)

                    #연관 콘텐츠 리스트 출력 
                    for item in top_k:
                        result.append(item[1])
                        result_sims.append( math.trunc((-item[0]) * 10000) / 10000 ) #소수 4째자리 아래 버림.
                    
                    fappendline('result.txt', ','.join(map(str,result))+ '\n')
                    fappendline('result.txt', ','.join(map(str,result_sims))+ '\n')
            #############################################################SAVE############################################################
            if current_step % 50000 == 0 :
                #process at savepoint
                #save
                with open(f'encoded_{current_step}.pickle', 'wb') as w:
                    pickle.dump(encodings, w)
                print(current_step,dt)
                print(f'encoded_{current_step}.pickle successfully saved!')

if __name__ == "__main__":
    main()