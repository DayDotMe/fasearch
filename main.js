const appId = "M19DXW5X0Q",
    apiKey = "c79b2e61519372a99fa5890db070064c",
    apiUrl = "https://m19dxw5x0q-dsn.algolia.net/1/indexes/fontawesome_com-5.15.3/query",
    prefixes = ["far", "fab", "fas"];

const iconsContainer = $('<div>');

$(() => {
    const input = $('<input>');
    input.keyup((ev) => {
        if (ev.target.value.length >= 2) {
            searchFontAwesome(ev.target.value)
        } else {
            iconsContainer.text("Au moins 2 char")
        }
    });
    $("body").append(input).append(iconsContainer);
});

function searchFontAwesome(query) {
    $.ajax({
        url: apiUrl,
        type: "POST",
        contentType: "application/json",
        headers: {
            "x-algolia-application-id": appId,
            "x-algolia-api-key": apiKey
        },
        data: JSON.stringify({
            query: query,
            facetFilters: [
                ["type:icon"], ["membership.free:solid", "membership.free:regular", "membership.free:brands"]
            ], // filter only free icons
            hitsPerPage: 1000
        }),
        success: ((res) => {
            if (res.hasOwnProperty("hits")) {
                generateIcons(res.hits);
            }
        })
    })
}

function generateIcons(icons) {
    iconsContainer.empty();
    iconsContainer.text(`${icons.length} résultat(s)`);
    iconsContainer.append(
        $('<br>')
    );
    for (const icon of icons) {
        let faIcon = window.FontAwesome.findIconDefinition({iconName: icon.name});
        if (!faIcon) {
            for (const prefix of prefixes) {
                faIcon = window.FontAwesome.findIconDefinition({iconName: icon.name, prefix: prefix});
                if (faIcon) {
                    break;
                }
            }
        }
        if (!faIcon) {
            continue;
        }
        iconsContainer.append(
            $('<a>').attr('href', '#').append(window.FontAwesome.icon(faIcon).html[0])
                .click((ev) => {
                    ev.preventDefault();
                    $(ev.target).parents("div").append(
                        $('<input>')
                            .val(`${faIcon.prefix} ${faIcon.iconName}`)
                            .attr('disabled', 'disabled')
                    )
                }).css({
                color: "black",
                fontSize: 32
            })
        );
    }
}
