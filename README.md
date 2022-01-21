# memento
Tools and scripts for use in Memento DB

Usage for R18 custom data source:
- add autofill, custom data source, search by title
- add r18autofill.js as external JS library 
- enter this source code (assumes presence of "JAV Actors" library with "Name" and "Image" fields)
```
var r18 = new R18("JAV Actors", "Name", "Image, "R18");
var res = r18.search(query);
result(res);
``` 
