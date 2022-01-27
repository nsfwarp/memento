# Memento scripts
Tools and scripts for use in Memento app for Android (untested on other platforms)

## Custom data sources
The following scripts may be used to add custom data sources, that can automatically fill your entries with data, e.g. fetched from some web service.

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
- all configured fields (except actors) should now be autofilled and actor objects should have been created

#### Linking actors to movies
The autofill data source script can create entries in the Actors library, but cannot link movies to actors yet. A workaround using trigger scripts is available. Follow these steps:
- in your movies library, have a field of type "link to entry" for the actors
- link this field to your actors library, many-to-many relationship
- make sure to also have an autofill rule for the "actorsJson" property (see table below)
 - store it in a text field (may be hidden)
- to your movies library, add a new trigger script
  - Event "Creating an entry"
  - Phase "After saving the entry"
  - add r18autofill.js as external JS library
  - add the following script (change parameters as needed)
```
// parameters:
// - name of the "link to entry" actors field in movie library
// - name of "actorsJson" field in movie library
// - name of actors library
// - name of the field holding the actor's name in the actors library
autolinkActors("Actors", "ActorsJson", "JAV Actors", "Name");
```
- add a second trigger script, same script content as before, but:
  - Event "Updating an entry"
  - Phase "Before saving the entry"

Now, whenever you create or update the movie entry, the scripts will automatically link all actors as stored in your actorsJson field. If actors are already linked (e.g. the script already ran once before or you made manual changes), then the script will abort and not overwrite existing actor links.

To reset the linked actors, simply delete all linked actors and save the entry - the script will restore the actor links according to your actorsJson field.

#### Properties returned by the autofill script

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
| actorsJson | string | JSON representation of all actor entries |
