# Memento scripts
Tools and scripts for use in Memento DB

## Custom data sources

### R18.com (nsfw) (src/r18autofill.js)
Fetches information about Japanese adult video (JAV) from R18.com, e.g. id, title, genres, runtime, release date, actresses, etc.

#### Usage in Memento DB:
- create a library for JAV actors (fields "Name" and "Image" recommended)
- create a library for JAV movies and add the fields you want (like "id", "title", "image", "actors", etc.)
- add autofill, "by title", custom data source, select the field holding the JAV ID
- add autofill rules for all the fields you want
- open script editor
- add r18autofill.js as external JS library 
- enter script source code (assumes presence of "JAV Actors" library with "Name" and "Image" fields)
```
var r18 = new R18("JAV Actors", "Name", "Image, "R18");
var res = r18.search(query);
result(res);
``` 
- back in the library, add a new movie item
- enter the complete id in the "search by title" field configured for the script (supported id formats: SIVR-102, SIVR102, sivr102, sivr-102)
- a suggestion box with the search result should pop up, tap it
- all configured fields should now be autofilled and actor objects should have been created

#### Properties returned by the script

| Property | Type | Content |
|----------|------|---------|
| title | string | (!) not actually the title, contains the JAV ID |
| id | string | JAV ID |
| desc | string | English title of the movie |
| thumb | string | image URL with the DVD jacket (front+back cover) |
| studio | string | name of production studio |
| label | string | name of production label |
| runtime | number | runtime in minutes |
| R18 | string | URL of the movie's page on R18.com |
| director | string | name of the director |
| vr | bool | true, if it is a VR movie |
| series | string | name of the series it belongs to (if any) |
| sample | string | URL of movie trailer / sample video (if available) |
| releaseDate | Date | release date of video on R18.com (might differ from DVD/Blu-Ray release date) |
| genres | array of strings | collection of "genres", tags or categories as R18 calls them |
| actors | array of strings | (currently broken) collection of names of actresses playing in that movie |
