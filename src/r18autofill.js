function R18(actorLibrary, actorNameField, actorImageField, actorUrlField) {
    this.actorLibrary = actorLibrary;
    this.actorNameField = actorNameField;
    this.actorImageField = actorImageField;
    this.actorUrlField = actorUrlField;
}

R18.prototype.search = function(id) {
    const contentId = id.replace(/([A-Z]+)-?([0-9]+)/i, "$100$2");
    const searchUrl = "https://www.r18.com/api/v4f/contents/" + encodeURIComponent(contentId);

    const response = http().get(searchUrl);
    const json = JSON.parse(response.body);
    const d = json.data;

    let res = {};

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
            for (let i = 0; i < d.categories.length; ++i) {
                res.genres.push(d.categories[i].name);
            }
        }

        if (d.actresses) {
            let actorLib = libByName(this.actorLibrary);
            let actors = [];

            for (let actress of d.actresses) {
                const foundActress = actorLib.findByKey(actress.name);
                if (foundActress) {
                    message("Found " + actress.name);
                    let jsonActor = {};
                    // TODO: handle cases when not all fields exist in the actor library
                    jsonActor[this.actorNameField] = foundActress.field(this.actorNameField);
                    jsonActor[this.actorImageField] = foundActress.field(this.actorImageField);
                    //jsonActor[this.actorUrlField] = foundActress.field(this.actorUrlField);
                    actors.push(jsonActor);
                } else {
                    let newActress = {};
                    newActress[this.actorNameField] = actress.name;
                    newActress[this.actorImageField] = actress.image_url;
                    newActress[this.actorUrlField] = actress.actress_url;
                    const newActressEntry = actorLib.create(newActress);
                    message("Created " + actress.name);
                    actors.push(newActress);
                }
            }

            res.actorsJson = JSON.stringify(actors);
        }
    }

    return res;
}

function autolinkActors(actorFieldName, actorJsonFieldName, actorLibraryName, actorNameFieldName) {
    let e = entry();
    let actorField = e.field(actorFieldName);

    // if actor links are already present, then do not overwrite
    // and just abort the function
    if (actorField.length > 0) return;

    let actorsJson = e.field(actorJsonFieldName);

    if (actorsJson) {
        let actors = JSON.parse(actorsJson);
        let actorLib = libByName(actorLibraryName);

        for (let actor of actors) {
            let libActor = actorLib.findByKey(actor[actorNameFieldName]);
            if (!libActor) {
                libActor = actorLib.create(actor);
                message("Created " + actor[actorNameFieldName]);
            } else {
                // message("Found " + actor[actorNameFieldName]);
            }
            e.link(actorFieldName, libActor);
            message("Linked ", actor[actorNameFieldName]);
        }
    }
}