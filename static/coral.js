(function() {
    let d = document, s = d.createElement('script');
    var url = 'localhost:3000';
    s.src = '//' + url + '/assets/js/embed.js';
    s.async = false;
    s.defer = true;
    s.onload = function() {
        Coral.createStreamEmbed({
            id: "coral_thread",
            autoRender: true,
            rootURL: '//' + url,
            // Uncomment these lines and replace with the ID of the
            // story's ID and URL from your CMS to provide the
            // tightest integration. Refer to our documentation at
            // https://docs.coralproject.net for all the configuration
            // options.
            // storyID: '${storyID}',
            // storyURL: '${storyURL}',
        });
    };
    (d.head || d.body).appendChild(s);
})();