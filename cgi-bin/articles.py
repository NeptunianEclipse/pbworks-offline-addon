#!/usr/bin/env python3

"""
1) change to directory

2) run server with one of
python -m CGIHTTPServer 8247
python -m http.server --cgi 8247
python3 -m http.server --cgi 8247

3) point browser at
http://localhost:8247/articles.html
"""

# specify custom path for python modules, e.g. for installs without admin rights
import sys
sys.path.append("H:\\apps\\Python27\\lib\\site-packages")

import cgi
import psycopg2

print("Content-type: text/html\n")
print("<title>articles</title>")
print("<body><center>")

try:
    # get post data
    form = cgi.FieldStorage()
    name = form['name'].value if 'name' in form else ''

    articles = []
    query = "select * from articles where article_name like '%{}%'".format(name)
    # connect to database
    conn = psycopg2.connect("dbname='articles' user='addon' host='127.0.0.1' password='capstone'")
    cursor = conn.cursor()
    
    cursor.execute(query)
    articles = cursor.fetchall()


    if len(articles) > 0:
        print("<p>related articles</p>"
              "<table border='1'>"
              "<tr>"
              "<th>name</th>"
              "<th>author</th>"
              "<th>description</th>"
              "</tr>"
              )
        for item in articles:
            print(
                "<tr>"
                "<td>{}</td>"
                "<td>{}</td>"
                "<td>{}</td>"
                "</tr>".format(item[0],item[1],item[2]))
        print("</table>")
    else:
        print("<H1>No related articles.</H1>")
except psycopg2.Error as e:
    # for ease of debugging
    print("Database Error: {}".format(e))
    print("<br>Query: {}".format(query))
    
print("""
<form action="../articles.html" method="GET">
    <input type="submit" value="Back to check webpage">
</form>
""")

print('</center></body>')
