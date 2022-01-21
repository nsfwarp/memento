function R18(actorLibrary, actorNameField, actorImageField, actorUrlField) {
    this.actorLibrary = actorLibrary;
    this.actorNameField = actorNameField;
    this.actorImageField = actorImageField;
    this.actorUrlField = actorUrlField;
}

R18.prototype.search = function(id) {
    var contentId = id.replace(/([A-Z]+)-?([0-9]+)/i, "$100$2");
    var searchUrl = "https://www.r18.com/api/v4f/contents/" + encodeURIComponent(contentId);

    var response = http().get(searchUrl);
    var json = JSON.parse(response.body);
    var d = json.data;

    var res = {};

    if (json.status == "OK") {
        res = {
            "title": d.dvd_id,
            "id": d.dvd_id,
            "desc": d.title,
            "thumb": d.images.jacket_image.large,
            "studio": d.maker ? d.maker.name : "",
            "label": d.label ? d.label.name : "",
            "runtime": Number(d.runtime_minutes),
            "R18": d.detail_url,
            "director": d.director,
            "vr": d.is_vr,
            "series": d.series ? d.series.name : "",
            "sample": d.sample ? (d.sample.high ? d.sample.high : "") : "",
            "releaseDate": d.release_date ? moment(d.release_date).toDate().getTime() : "",
        }

        if (d.categories) {
            res.genres = [];
            for (i = 0; i < d.categories.length; ++i) {
                var cat = d.categories[i];
                res.genres.push(cat.name);
            }
        }

        if (d.actresses) {
            var actorLib = libByName(this.actorLibrary);
            res.actors = [];

            for (i = 0; i < d.actresses.length; ++i) {
                var actress = d.actresses[i];
                var finds = actorLib.find(actress.name);
                var found = false;
                for (j = 0; j < finds.length & !found; ++j) {
                    var foundActress = finds[j];
                    if (foundActress.name == actress.name) {
                        message("Found " + actress.name);
                        found = true;
                        // TODO: figure out what type of object is required to be pushed here
                        res.actors.push(actress.name);
                    }
                }

                if (!found) {
                    var newActress = {};
                    newActress[this.actorNameField] = actress.name;
                    newActress[this.actorImageField] = actress.image_url;
                    newActress[this.actorUrlField] = actress.actress_url;
                    var newActressEntry = actorLib.create(newActress);
                    message("Created " + newActressEntry.name);
                    // TODO: figure out what type of object is required to be pushed here
                    res.actors.push(newActressEntry.name);
                }
            }
        }
    }

    return res;
}

R18.prototype.getDetails = function(id) {
    // TODO: dostuff
}