function log(msg) {
    console.log(msg);
}
$(document).ready(function() {
    function isEmpty(string) {
        if (string == "" || string == " ") {
            return true;
        }
        return false
    }
    // Setup on open ======================================
    function setItem(name, val, exp) {
        if (exp) {
            localStorage.setItem(name, val);
        } else {
            if (!localStorage.getItem(name)) {
                localStorage.setItem(name, val);
            }
        }
    }
    setItem('selected search engine', 'Duckduckgo');
    setItem('history', ' ');
    setItem('closed', '0');
    if (localStorage.getItem('closed') == '1') {
        $('.info').remove();
    }
    if (!localStorage.getItem('engines') || localStorage.getItem('engines') == 'Google$§$https://www.google.de/search?&q=$§$https://s28.postimg.org/90nwclcul/Google.png@@@@@@@@@@Google Bilder$§$https://www.google.de/search?tbm=isch&q=$§$https://s29.postimg.org/iau9dglkn/Google_Bilder.png@@@@@@@@@@Duckduckgo$§$https://duckduckgo.com/?q=$§$https://s23.postimg.org/klnykap2z/Ducki.png') {
        localStorage.setItem('engines', 'Duckduckgo$§$https://duckduckgo.com/?q=$§$https://s23.postimg.org/klnykap2z/Ducki.png@@@@@@@@@@Google$§$https://www.google.de/search?&q=$§$https://s28.postimg.org/90nwclcul/Google.png@@@@@@@@@@Google Bilder$§$https://www.google.de/search?tbm=isch&q=$§$https://s29.postimg.org/iau9dglkn/Google_Bilder.png@@@@@@@@@@Youtube$§$https://www.youtube.com/results?search_query=$§$https://s23.postimg.org/7sxbffy57/Youtube.png@@@@@@@@@@Google Maps$§$https://www.google.de/maps/search/$§$https://s24.postimg.org/ozbhwqs5h/Google_Maps.png@@@@@@@@@@Wikipedia$§$https://de.wikipedia.org/w/index.php?search=$§$http://www.deskmodder.de/blog/wp-content/uploads/2014/12/wikipedia.png@@@@@@@@@@Soundcloud$§$https://soundcloud.com/search?q=$§$http://www.adweek.com/core/wp-content/uploads/sites/2/2015/11/SoundCloud-Logo.jpg@@@@@@@@@@Leo German - English$§$http://dict.leo.org/german-english/$§$https://dict.leo.org/img/favicons/ende-192-c663c75d.png@@@@@@@@@@Leo German - Español$§$http://dict.leo.org/spanisch-deutsch/$§$https://s24.postimg.org/6rkwtc1et/leo_de_es.png');
    }
    var rawEngines = localStorage.getItem('engines');
    var engines = rawEngines.split('@@@@@@@@@@');
    var rawHistory = localStorage.getItem('history');
    var history = rawHistory.split('/');
    for (var i = history.length - 1; i > 0; i = i - 2) { //Add recent searches to the History
        $('#history_new-line').tmpl({
            "search": history[i - 1],
            "engine": history[i]
        }).appendTo('#history_list');
    }
    //
    for (var i = $('.tool_icon').length - 1; i >= 0; i--) {
        var curr = $('.tool_icon')[i];
        var id = $(curr).attr('id');
        var a = id.substr(0, parseInt(id.length - 2)); // Set tools id without '-n' to its title
        var t = a.charAt(0).toUpperCase() + a.slice(1);
        $(curr).attr('title', t);
    }
    refreshContent();
    //
    $('#default_searcher').tmpl({}).appendTo('.DEFAULT h3');
    //
    $(window).scroll(function() {
        var pos = $(window).scrollTop(),
            tolerance = $(window).height() / 10; //Setup the title hider
        if (pos > tolerance) {
            $('#header-text').addClass('disabled');
            $('#title').addClass('disabled');
            $('#header img').addClass('disabled');
            $('#header').css('height', '70px');
            $('#searchInput').css('top', '10px');
            $('#searchInput').css('top', '10px');
        }
        if (pos < tolerance) {
            $('#header').css('height', '190px');
            $('#searchInput').css('top', '110px');
            $('#searchInputField').css('top', '10px');
            $('#header-text').removeClass('disabled');
            $('#title').removeClass('disabled');
            $('#header img').removeClass('disabled');
        }
    });

    function message(backC, msg, appearTime) { //print a message in Message Header
        $('#message_header').css('background-color', backC);
        $('#message_header').fadeIn(appearTime).removeClass('disabled');
        $('#message_header').html(msg);
    }

    function changeDefault(newDef) {
        $('.searcher').removeClass('DEFAULT');
        $(newDef).addClass('DEFAULT');
        $('#switch').attr('data-default', 'DEFAULT_is_set');
        $('#message_header').fadeOut(800);
        localStorage.setItem('selected search engine', $(newDef).attr('data-name'));
        $('#searchInputField').focus();
        $('.DEFAULT_text').remove();
        $('#default_searcher').tmpl({}).appendTo('.DEFAULT h3');
    }
    var editSearcher;

    function refreshContent() {
        $('.searcher').remove();
        $('#new_behind-searchers').remove();
        rawEngines = localStorage.getItem('engines');
        engines = rawEngines.split('@@@@@@@@@@');
        for (var i = 0; i <= engines.length - 1; i++) {
            var attributes = engines[i].split('$§$');
            $('#new-searcher').tmpl({
                name: attributes[0],
                url: attributes[1],
                image: attributes[2]
            }).appendTo('#searcher-table');
            // $.ajax({ //Get description
            //     url: attributes[1],
            //     type: 'GET',
            //     success: function(data) {
            //         desc = $(data.responseText).filter('[name=description]').attr('content');
            //         if (!desc) {
            //             desc = "I would like to display a description here but the website doesn't allow it.";
            //         }
            //         if (desc.length > 75) {
            //             desc = desc.slice(0, 73) + '...';
            //         }
            //         log(desc);
            //     }
            // });
        }
        for (var i = $('.searcher').length - 1; i >= 0; i--) {
            var curr = $('.searcher')[i];
            var name = $(curr).attr('data-name');
            $(curr).children('h3').html(name); //Set the searcher title to its name
            $(curr).attr('title', 'Search with ' + name);
        }
        $('#new-tmpl').tmpl({}).appendTo('#searcher-table');
        var default_engine = localStorage.getItem('selected search engine');
        var default_engine_selector = '[data-name="' + default_engine + '"]';
        if ($(default_engine_selector).length == 0) {
            $('.searcher:eq(0)').addClass('DEFAULT');
        } else {
            $(default_engine_selector).addClass('DEFAULT');
        }
        //
        $('.edit-searcher').click(function() {
            invertIt('#edit')
            var parent = $(event.target).parent('li');
            editSearcher = $(parent);
            $('#edit_search-url').val(parent.attr('data-url'));
            $('#edit_name').val(parent.attr('data-name'));
            var style = parent.children('.simage').attr('style');
            $('#edit_image-url').val(style.slice(22, -1)); //Extract the url of the image
        });
        $('.searcher').on('click', function(event) { //Search with selected engine
            if ($(event.target).attr('class').includes('edit-searcher')) {
                //
            } else if ($('#switch').attr('data-default') == 'DEFAULT_is_set') {
                searchIt(event.target);
            } else { //Choose a new default engine
                changeDefault($(event.target).closest('li'));
            }
        });
        var isMobile = window.matchMedia("only screen and (max-width: 760px)");
        if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
            $('.edit-searcher').removeClass('transparent');
        } else {
            $('.searcher').on('mouseover', function(target) {
                $(target.target).children('.edit-searcher').removeClass('transparent');
            });
            $('.searcher').on('mouseleave', function(target) {
                $('.edit-searcher').addClass('transparent');
            });
        }
        $('#new_behind-searchers').css('height', $('.DEFAULT').css('height'));
        $('window').on('resize', function() {
            $('#new_behind-searchers').css('height', $('.DEFAULT').css('height'));
        });
    }
    //Edit Controller ================================
    $('#submit-edit').click(function() {
        var rawEngines = localStorage.getItem('engines');
        var name1 = editSearcher.attr('data-name');
        var url1 = editSearcher.attr('data-url');
        var image1 = editSearcher.children('.simage').attr('style').slice(22, -1);
        editSearcher.attr('data-name', $('#edit_name').val());
        editSearcher.attr('data-url', $('#edit_search-url').val());
        editSearcher.children('.simage').attr('style', 'background-image: url(' + $('#edit_image-url').val() + ')');
        var name2 = editSearcher.attr('data-name');
        var url2 = editSearcher.attr('data-url');
        var image2 = editSearcher.children('.simage').attr('style').slice(22, -1);
        var editedEngines = rawEngines.replace(name1 + '$§$' + url1 + '$§$' + image1, name2 + '$§$' + url2 + '$§$' + image2);
        localStorage.setItem('engines', editedEngines);
        refreshContent();
        closePopups();
    });
    // Tools Animation Controller =========================
    function invertIt(target) { //animate the tools icons
        event.preventDefault();
        $('#switch').attr('data-default', 'DEFAULT_is_set');
        $('#message_header').fadeOut(800);
        $(target + '_popup').toggleClass('disabled');
        $('.popup:not(' + target + '_popup)').addClass('disabled');
        $('.n:not(' + target + '-i):not(' + target + '-n)').removeClass('disabled');
        $('.i:not(' + target + '-i):not(' + target + '-n)').addClass('disabled');
        $(target + '-i').toggleClass('disabled');
        $(target + '-n').toggleClass('disabled');
        if (target == "#new" || target == "#edit") {
            $("#background-hider_important").removeClass('disabled');
        } else {
            if ($(target + '-i').attr('class').includes('disabled')) {
                $('#background-hider_withCorner').addClass('disabled');
            } else {
                $('#background-hider_withCorner').removeClass('disabled');
            }
        }
    }

    function deselectAll() { //reset the tool icons
        $('.i').addClass('disabled');
        $('.n').removeClass('disabled');
    }
    // Popup Controller ===================================
    function closePopups() { //Close all Pupups
        event.preventDefault();
        $('.popup').addClass('disabled');
        $('#switch').attr('data-default', 'DEFAULT_is_set');
        $('#message_header').fadeOut(600);
        $('#background-hider_important').addClass('disabled');
        $('#background-hider_withCorner').addClass('disabled');
        deselectAll();
    }
    //
    $('body').on("keydown", function(event) { //Close all Popups when ESC is pressed
        if (event.which == 27) { //esc
            closePopups();
        }
    });
    $('.popup-close').click(function() {
        closePopups();
    });
    $('#background-hider_important').click(function() {
        closePopups();
    });
    $('#background-hider_withCorner').click(function() {
        closePopups();
    });
    // Search Controller ==================================
    function searchIt(target) {
        var search = $('#searchInputField').val();
        if (search.includes('/') || search.includes('&') || search.includes('#')) { //Search should not contain / and &
            message('red', 'The search cannot contain special caracters like / , & and #', 300);
            $('#message_header').fadeOut(4000);
        } else { //Search
            var engine = $(target).closest('li');
            var name = $(engine).attr('data-name');
            var url = $(engine).attr('data-url');
            window.location.href = '' + url + search;
            if (search != '' && search != ' ') { //If search is empty dont append to history
                localStorage.setItem('history', rawHistory + '/' + search + '/' + name);
            }
        }
    }
    $("#searchInputField").on("keydown", function(event) { //Search with default engine when ENTER is pressed
        if (event.which == 13) { //Enter
            searchIt('.DEFAULT');
        }
    });
    //
    $('#searchInputIcon').click(function() {
        var search = $('#searchInputField').val();
        if (search != '' && search != ' ') {
            searchIt('.DEFAULT');
        }
    });
    // Settings Controller =================================
    $('#settings').click(function() { //open settings popup
        invertIt('#settings');
    });
    //
    $('#remove-data').click(function() {
        localStorage.clear();
        closePopups();
        window.location.reload();
    });
    //
    $('#change-default').click(function(event) {
        event.preventDefault();
        $('.popup').addClass('disabled');
        $('#background-hider').addClass('disabled');
        $('#switch').attr('data-default', '');
        message('green', 'Select a search engine by clicking on it.', 1200);
        deselectAll();
    });
    // Info Controller =====================================
    $('#info').click(function() { //open info popup
        invertIt('#info');
    });
    $('.info').on('click', function(event) {
        setItem('closed', '1', true);
        $(event.target).remove();
    });
    // New Controller ======================================
    /*$('#new').click(function() { //open new search engine popup
        invertIt('#new');
    });*/
    $('#new_behind-searchers').click(function() {
        invertIt('#new');
    });
    $('#add-new').click(function(event) { //add a new search engine 
        event.preventDefault();
        var name = $('#new_name').val(),
            url = $('#new_search-url').val(),
            image = $('#new_image-url').val(),
            create = true;
        for (var i = engines.length - 1; i >= 0; i--) {
            var attributes = engines[i].split('$§$');
            if (name == attributes[0] || url == attributes[1] || image == attributes[2]) {
                create = false;
            }
        }

        function uncorrect(what) {
            if (what.includes('@@@@@@@@@@') || what.includes('$§$')) {
                return true;
            }
            return false;
        }

        function isExternal(url) {
            var exRegex = /(https?:\/\/(?:www\.|(?!www))[^\s\.]+\.[^\s]{2,}|www\.[^\s]+\.[^\s]{2,})/;
            return !exRegex.test(url);
        }
        if (isEmpty(name) || isEmpty(image) || isEmpty(url) || isExternal(image) || isExternal(url)) {
            message('red', 'Please fill out all fields correctly.', 800);
            $('#message_header').fadeOut(3000);
        } else if (uncorrect(name) || uncorrect(url) || uncorrect(image)) {
            message('red', 'Dont the caracter combinations @@@@@@@@@@ and $§$.', 800);
            $('#message_header').fadeOut(3000);
        } else if (!create) {
            message('red', 'You already added that search engine.', 800);
            $('#message_header').fadeOut(3000);
        } else {
            $('#new-searcher').tmpl({
                name: name,
                url: url,
                image: image
            }).appendTo('#searcher-table');
            localStorage.setItem('engines', rawEngines + '@@@@@@@@@@' + name + '$§$' + url + '$§$' + image);
            refreshContent();
            closePopups();
            $('input:not(#searchInputField)').val('');
        }
    });
    // History Controller ==================================
    $('#history').click(function() { //open the history tab
        invertIt('#history');
    });
    $('#history_popup li').on('click', function(event) { //Search something again
        var li_val = $(event.target).closest('div .history-table-search').html();
        $('#searchInputField').val(li_val);
        $('#history_popup').addClass('disabled');
        $('#searchInputField').focus();
        closePopups();
    });
    $('#history_popup li').hover(function(event) {
        $('.history-table-search').css('border-right', '2px solid rgb(197, 197, 197)');
        $(event.target).closest('.history-table-engine').css('border-right', 'none');
    });
    $('#edit-remove').click(function(event) {
        editSearcher.closest('.searcher').remove();
        var rawEngines = localStorage.getItem('engines');
        var removed = rawEngines.replace('@@@@@@@@@@' + editSearcher.attr('data-name') + '$§$' + editSearcher.attr('data-url') + '$§$' + editSearcher.children('.simage').attr('style').slice(22, -1), '');
        localStorage.setItem('engines', removed);
        closePopups();
    });
});