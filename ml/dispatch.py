import numpy as np
import sys
import pickle
import time
from dotenv import load_dotenv
import mysql.connector
import os
import heapq
import torch

# os.environ["CUDA_DEVICE_ORDER"]="PCI_BUS_ID"
# os.environ["CUDA_VISIBLE_DEVICES"]="0"

# print(f"Using GPU is CUDA:{os.environ['CUDA_VISIBLE_DEVICES']}")

# for i in range(torch.cuda.device_count()):
#     info = torch.cuda.get_device_properties(i)
#     print(f"CUDA:{i} {info.name}, {info.total_memory / 1024 ** 2}MB")

# device = torch.device("cuda:0")
'''
입력값 #  sys.argv[1] : 파일 이름,  sys.argv[2] : 시작 KEY 값

# 기준 KEY 값과 다른 벡터들의 코사인 유사도를 측정한 후 
# 코사인 유사도 기준으로 k개 뽑아서
# 절댓값으로 25개 뽑은후
# 장르 유사도로 정렬
'''

'''
####수정된 사항####

1. 모든 장르 동일한 기준으로 연관 콘텐츠 리스트 생성
    # 수정 전)
    # 애니메이션은 장르 유사도로 25개 자르고, 절댓값으로 정렬
    # if gvector[c][2] == 1:
    #     top_k.sort(key = lambda x : np.dot(gvector[id_sparse[x[1]]], gvector[c]))
    #     rec = top_k[-25:]
    #     rec.sort(key = lambda x : np.linalg.norm(encodings[x[1]]))

2. 정렬 => heapify
    # 수정 전)
    # 코사인 유사도가 가장 큰 k 개의 아이템 추출
    # sims.sort(key = lambda x: x[0]) 

3.  np.linalg.norm(targetencoding) 연산 결과를 가진 변수 y를 sims 배열에 추가

4. x = np.linalg.norm(criteria_encoding) 상위 루프로 이동

'''

load_dotenv(verbose=True)

current_directory = os.path.dirname(os.path.dirname(__file__))
file_path = os.path.join(current_directory, 'ml/preprocessed.csv')


k = 77            #top_k
# variables
id_sparse = [0] # dense_id -> sparse_id
id_dense = {} # sparse_id -> dense_id
dict_item = {} # sparse_id -> movie_name
released= {}
gvector={}
encodings = {}
result = []

DBID = os.getenv('DBID')
DBPASS = os.getenv('DBPASS')
def main():
    filename = sys.argv[1]     # 입력값으로 파일 이름 받아서 실행
    insert_query = "INSERT INTO moviecsv (movieid,recC) VALUES (%s, %s) ON DUPLICATE KEY UPDATE recC=VALUES(recC)"

    #load encodings
    with open(filename, 'rb') as f:
        encodings = pickle.load(f)

    with open(file_path, 'r') as p :
        for idx , line in enumerate(p):
            line = line.strip()
            line = line.split('|')
            movie_id = int(line[0])
            dict_item[movie_id] = line[1]
            released[movie_id] = line[2]
            gvector[movie_id] = np.array(list(map(int, line[3])))
            id_sparse.append(movie_id)
            id_dense[movie_id] = idx+1
    print(len(id_dense),len(id_sparse))
    with mysql.connector.connect(
        host="localhost",
        user=DBID,
        password=DBPASS,
        database="db23202"
    ) as connection:
        with connection.cursor() as cursor:
                # 루프 시작
            for key in range(int(sys.argv[2]),len(encodings)) :
                # 이하 코드
                print(key)
                key_sparse = id_sparse[key]
                result = []
                top_k = []
                sims = []
                
                print(f'encoding#{key}')
                t0 = time.time()
                criteria_encoding = encodings[key]
                x = np.linalg.norm(criteria_encoding)

                # 인코딩 벡터간의 코사인 거리 측정
                for e in encodings:
                    if e != key:
                        target_encoding = encodings[e]
                        mul = np.dot(criteria_encoding, target_encoding)
                        y = np.linalg.norm(target_encoding)
                        cos_sim = mul / (x*y)
                        sims.append((-cos_sim, id_sparse[e], y))
                        
                # 코사인 유사도가 가장 큰 k 개의 아이템 추출
                # heapify 
                heapq.heapify(sims)
                for i in range(k):
                    top_k.append(heapq.heappop(sims))

                # k 개 중에서 절댓값 크기 순서로 15개 자르고, 장르 유사성으로 정렬
                # heapify로 변경할 여지가 있습니다.
                top_k.sort(key = lambda x : x[2]) # x[2] = np.linalg.norm(target_encoding)
                top_k = top_k[-15:]
                print(key_sparse)
                top_k.sort(key = lambda x : np.dot(gvector[x[1]], gvector[key_sparse]), reverse = True)

                #연관 콘텐츠 리스트 출력 
                for item in top_k:
                    result.append(item[1])

                recC_str = ','.join(map(str, result))
                data = (key_sparse, recC_str)

                cursor.execute(insert_query, data)
                connection.commit()

                # key : result
                print(','.join(map(str,result)))
                print(str(time.time() - t0) + "초 소요\n")


if __name__ == "__main__":
    main()