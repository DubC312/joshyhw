#!/usr/bin/env python3
import json,time
from pathlib import Path
import requests
from bs4 import BeautifulSoup
BASE="https://hotwheels.fandom.com"
API=BASE+"/api.php"
PATH=Path(__file__).resolve().parent/"monster-trucks.json"

def load():
 return [json.loads(x) for x in PATH.read_text(encoding="utf-8").splitlines() if x.strip()]
def save(rows):
 with PATH.open("w",encoding="utf-8") as f:
  for r in rows:f.write(json.dumps(r,ensure_ascii=False,separators=(",",":"))+"\\n")
def getpage(page):
 r=requests.get(API,params={"action":"parse","page":page,"prop":"text","format":"json","origin":"*"},
                headers={"User-Agent":"VorschuleEntdecker/2.0 educational personal app"},timeout=30)
 r.raise_for_status(); d=r.json()
 if "error" in d: raise RuntimeError(d["error"])
 return d["parse"]["text"]["*"]
def find_image(html,toy,name):
 soup=BeautifulSoup(html,"html.parser")
 rows=[tr for tr in soup.find_all("tr") if toy and toy in " ".join(tr.stripped_strings)]
 if not rows:
  rows=[tr for tr in soup.find_all("tr") if name and name.lower() in " ".join(tr.stripped_strings).lower()]
 for tr in rows:
  for img in tr.find_all("img"):
   for a in ("data-src","src"):
    s=img.get(a,"")
    if s.startswith("//"):s="https:"+s
    if "static.wikia.nocookie.net" in s or "vignette.wikia.nocookie.net" in s:return s
 return ""
def main():
 rows=load(); groups={}
 for r in rows:groups.setdefault(r["fandomPage"],[]).append(r)
 found=0
 for page,items in groups.items():
  print("Lese:",page)
  try: html=getpage(page)
  except Exception as e: print(" FEHLER:",e);continue
  for r in items:
   img=find_image(html,r.get("toy",""),r.get("name",""))
   if img:r["image"]=img;r["imagePage"]=r["fandomUrl"];found+=1
  time.sleep(.4)
 save(rows)
 print(f"Fertig: {found}/{len(rows)} Bilder gefunden.")
 print("monster-trucks.json: weiterhin genau ein Truck pro Zeile.")
if __name__=="__main__":main()
