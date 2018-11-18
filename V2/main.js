const CONFIG = {
    commands: [
        [null, 'DuckDuckGo', '*', 'https://duckduckgo.com/', '/{}?ia=web', ''],
        ['Bookmarks', 'Canvas', 'c', 'https://utk.instructure.com/', '', '#394b58'],
        ['Bookmarks', 'Drive', 'd', 'https://drive.google.com', '/drive/search?q={}', '#4285f4'],
        ['Bookmarks', 'GitHub', 'g', 'https://github.com', '/search?q={}', '#24292e'],
        ['Bookmarks', 'Mail', 'm', 'https://mail.google.com', '/#search/{}', '#d93025'],
        ['Bookmarks', 'Netflix', 'n', 'https://www.netflix.com/browse', '/search?q={}', '#141414'],
        ['Bookmarks', 'Reddit', 'r', 'https://www.reddit.com', '/search?q={}&include_over_18=on', '#5f99cf'],
        ['Bookmarks', 'MyUTK', 'u', 'https://my.utk.edu', '', "#ff8200"],
        ['Bookmarks', 'YouTube', 'y', 'https://youtube.com/feed/subscriptions', '', '#ff0000'],
    ],
    suggestions: true,
    suggestionsLimit: 4,
    influencers: [{
            name: 'Default',
            limit: 4
        },
        {
            name: 'DuckDuckGo',
            limit: 4
        },
    ],
    defaultSuggestions: {
        'd': ['d/u/0', 'd/u/1'],
        'm': ['m/mail/u/0/', 'm/mail/u/1/'],
    },
    newTab: false,
    searchDelimiter: ':',
    pathDelimiter: '/',
};

const greetings = ["hello world", "hola", " bonjour", "welcome home", "bienvenue", "bienvenidos",
    "olá", "dzien' dobry", "hej", "ciào", "guten tag", "hallo",
    "ello", "salut", "saluton", "salve", "dobro požalovat", "walcome", "alatuyla",
    "konnichi wa", "marhaba", "jambo", "ni hau", "o shit waddup",
    "moshi moshi", "hi welcome to chili's", "hoi", "goedendag", "hyvää päivää",
    "shalom", "ma kore", "namaste", "ohayou gozaimasu", "kwe kwe", "nuqneh",
    "sup braddah", "moïen", "sain baina uu", "ya'at'eeh", "privet", "zdravstvuyte",
    "shwmai", "sawubona"
];

document.title = greetings[Math.floor(Math.random() * greetings.length)];

const $ = {
    bodyClassAdd: c => $.el('body').classList.add(c),
    bodyClassRemove: c => $.el('body').classList.remove(c),
    el: s => document.querySelector(s),
    els: s => [].slice.call(document.querySelectorAll(s) || []),
    escapeRegex: s => s.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&'),
    ieq: (a, b) => a.toLowerCase() === b.toLowerCase(),
    iin: (a, b) => a.toLowerCase().indexOf(b.toLowerCase()) !== -1,
    isDown: e => ['c-n', 'down', 'tab'].includes($.key(e)),
    isRemove: e => ['backspace', 'delete'].includes($.key(e)),
    isUp: e => ['c-p', 'up', 's-tab'].includes($.key(e)),

    jsonp: url => {
        let script = document.createElement('script');
        script.src = url;
        $.el('head').appendChild(script);
    },

    key: e => {
        const ctrl = e.ctrlKey;
        const shift = e.shiftKey;

        switch (e.which) {
            case 8:
                return 'backspace';
            case 9:
                return shift ? 's-tab' : 'tab';
            case 13:
                return 'enter';
            case 16:
                return 'shift';
            case 17:
                return 'ctrl';
            case 18:
                return 'alt';
            case 27:
                return 'escape';
            case 38:
                return 'up';
            case 40:
                return 'down';
            case 46:
                return 'delete';
            case 78:
                return ctrl ? 'c-n' : 'n';
            case 80:
                return ctrl ? 'c-p' : 'n';
            case 91:
                return 'super';
        }
    },

    pad: v => ('0' + v.toString()).slice(-2),
};

class Clock {
    constructor(options) {
        this._el = $.el('#clock');
        this._form = options.form;
        this._setTime = this._setTime.bind(this);
        this._el.addEventListener('click', this._form.show);
        this._start();
    }

    _setTime() {
        const date = new Date();
        let hours = $.pad(date.getHours()); // why 3? idk my browser is stupid
        const minutes = $.pad(date.getMinutes());
        this._el.innerHTML = `${hours}${minutes} `;
        this._el.setAttribute('datetime', date.toTimeString());
    }

    _start() {
        this._setTime();
        setInterval(this._setTime, 1000);
    }
}

class Help {
    constructor(options) {
        this._el = $.el('#help');
        this._commands = options.commands;
        this._newTab = options.newTab;
        this._toggled = false;
        this._handleKeydown = this._handleKeydown.bind(this);
        this._buildAndAppendLists();
        this._registerEvents();
    }

    toggle(show) {
        this._toggled = (typeof show !== 'undefined') ? show : !this._toggled;
        this._toggled ? $.bodyClassAdd('help') : $.bodyClassRemove('help');
    }

    _buildAndAppendLists() {
        const lists = document.createElement('ul');
        lists.classList.add('categories');

        this._getCategories().forEach(category => {
            lists.insertAdjacentHTML(
                'beforeend',
                `<li class="category">
            <ul>${this._buildListCommands(category)}</ul>
          </li>`,
            );
        });

        this._el.appendChild(lists);
    }

    _buildListCommands(category) {
        return this._commands
            .map(([cmdCategory, name, key, url]) => {
                if (cmdCategory === category) {
                    return (
                        `<li class="command">
                <a href="${url}" target="${this._newTab ? '_blank' : '_self'}">
                  <span class="command-key">${key}</span>
                  <span class="command-name">${name}</span>
                </a>
              </li>`
                    );
                }
            })
            .join('');
    }

    _getCategories() {
        const categories = this._commands
            .map(([category]) => category)
            .filter(category => category);

        return [...new Set(categories)];
    }

    _handleKeydown(e) {
        if ($.key(e) === 'escape') this.toggle(false);
    }

    _registerEvents() {
        document.addEventListener('keydown', this._handleKeydown);
    }
}

class Influencer {
    constructor(options) {
        this._limit = options.limit;
        this._queryParser = options.queryParser;
    }

    addItem() {}
    getSuggestions() {}

    _addSearchPrefix(items, query) {
        const searchPrefix = this._getSearchPrefix(query);
        return items.map(s => searchPrefix ? searchPrefix + s : s);
    }

    _getSearchPrefix(query) {
        const {
            isSearch,
            key,
            split
        } = this._parseQuery(query);
        return isSearch ? `${key}${split} ` : false;
    }

    _parseQuery(query) {
        return this._queryParser.parse(query);
    }
}

class DefaultInfluencer extends Influencer {
    constructor({
        defaultSuggestions
    }) {
        super(...arguments);
        this._defaultSuggestions = defaultSuggestions;
    }

    getSuggestions(query) {
        return new Promise(resolve => {
            const suggestions = this._defaultSuggestions[query];
            resolve(suggestions ? suggestions.slice(0, this._limit) : []);
        });
    }
}

class DuckDuckGoInfluencer extends Influencer {
    constructor({
        queryParser
    }) {
        super(...arguments);
    }

    getSuggestions(rawQuery) {
        const {
            query
        } = this._parseQuery(rawQuery);
        if (!query) return Promise.resolve([]);

        return new Promise(resolve => {
            const endpoint = 'https://duckduckgo.com/ac/';
            const callback = 'autocompleteCallback';

            window[callback] = res => {
                const suggestions = res.map(i => i.phrase)
                    .filter(s => !$.ieq(s, query))
                    .slice(0, this._limit);

                resolve(this._addSearchPrefix(suggestions, rawQuery));
            };

            $.jsonp(`${endpoint}?callback=${callback}&q=${query}`);
        });
    }
}

class Suggester {
    constructor(options) {
        this._el = $.el('#search-suggestions');
        this._influencers = options.influencers;
        this._limit = options.limit;
        this._suggestionEls = [];
        this._handleKeydown = this._handleKeydown.bind(this);
        this._registerEvents();
    }

    setOnClick(callback) {
        this._onClick = callback;
    }

    setOnHighlight(callback) {
        this._onHighlight = callback;
    }

    setOnUnhighlight(callback) {
        this._onUnhighlight = callback;
    }

    success(query) {
        this._clearSuggestions();
        this._influencers.forEach(i => i.addItem(query));
    }

    suggest(input) {
        input = input.trim();
        if (input === '') this._clearSuggestions();

        Promise.all(this._getInfluencerPromises(input)).then(res => {
            const suggestions = Suggester._flattenAndUnique(res);
            this._clearSuggestions();

            if (suggestions.length) {
                this._appendSuggestions(suggestions, input);
                this._registerSuggestionEvents();
                $.bodyClassAdd('suggestions');
            }
        });
    }

    // [[1, 2], [1, 2, 3, 4]] -> [1, 2, 3, 4]
    static _flattenAndUnique(array) {
        return [...new Set([].concat.apply([], array))];
    }

    _appendSuggestions(suggestions, input) {
        for (const [i, suggestion] of suggestions.entries()) {
            const match = new RegExp($.escapeRegex(input), 'ig');
            const suggestionHtml = suggestion.replace(match, `<b>${input}</b>`);

            this._el.insertAdjacentHTML(
                'beforeend',
                `<li>
            <button
              type="button"
              class="js-search-suggestion search-suggestion"
              data-suggestion="${suggestion}"
              tabindex="-1"
            >
              ${suggestionHtml}
            </button>
          </li>`,
            );

            if (i + 1 >= this._limit) break;
        }

        this._suggestionEls = $.els('.js-search-suggestion');
    }

    _clearClickEvents() {
        this._suggestionEls.forEach(el => {
            const callback = this._onClick.bind(null, el.value);
            el.removeEventListener('click', callback);
        });
    }

    _clearSuggestions() {
        $.bodyClassRemove('suggestions');
        this._clearClickEvents();
        this._suggestionEls = [];
        this._el.innerHTML = '';
    }

    _focusNext(e) {
        const exists = this._suggestionEls.some((el, i) => {
            if (el.classList.contains('highlight')) {
                this._highlight(this._suggestionEls[i + 1], e);
                return true;
            }
        });

        if (!exists) this._highlight(this._suggestionEls[0], e);
    }

    _focusPrevious(e) {
        const exists = this._suggestionEls.some((el, i) => {
            if (el.classList.contains('highlight') && i) {
                this._highlight(this._suggestionEls[i - 1], e);
                return true;
            }
        });

        if (!exists) this._unHighlight(e);
    }

    _getInfluencerPromises(input) {
        return this._influencers
            .map(influencer => influencer.getSuggestions(input));
    }

    _handleKeydown(e) {
        if ($.isDown(e)) this._focusNext(e);
        if ($.isUp(e)) this._focusPrevious(e);
    }

    _highlight(el, e) {
        this._unHighlight();

        if (el) {
            this._onHighlight(el.getAttribute('data-suggestion'));
            el.classList.add('highlight');

            e.preventDefault();
        }
    }

    _registerEvents() {
        document.addEventListener('keydown', this._handleKeydown);
    }

    _registerSuggestionEvents() {
        const noHighlightUntilMouseMove = () => {
            window.removeEventListener('mousemove', noHighlightUntilMouseMove);

            this._suggestionEls.forEach(el => {
                const value = el.getAttribute('data-suggestion');
                el.addEventListener('mouseover', this._highlight.bind(this, el));
                el.addEventListener('mouseout', this._unHighlight.bind(this));
                el.addEventListener('click', this._onClick.bind(null, value));
            });
        };

        window.addEventListener('mousemove', noHighlightUntilMouseMove);
    }

    _unHighlight(e) {
        const el = $.el('.highlight');

        if (el) {
            this._onUnhighlight();
            el.classList.remove('highlight');
            if (e) e.preventDefault();
        }
    }
}

class QueryParser {
    constructor(options) {
        this._commands = options.commands;
        this._searchDelimiter = options.searchDelimiter;
        this._pathDelimiter = options.pathDelimiter;
        this._protocolRegex = /^[a-zA-Z]+:\/\//i;
        this._urlRegex = /^((https?:\/\/)?[\w-]+(\.[\w-]+)+\.?(:\d+)?(\/\S*)?)$/i;
    }

    parse(query) {
        const res = {
            query: query,
            split: null
        };

        if (query.match(this._urlRegex)) {
            const hasProtocol = query.match(this._protocolRegex);
            res.redirect = hasProtocol ? query : 'http://' + query;
        } else {
            const splitSearch = query.split(this._searchDelimiter);
            const splitPath = query.split(this._pathDelimiter);

            this._commands.some(([category, name, key, url, searchPath]) => {
                res.isKey = query === key;
                res.isSearch = !res.isKey && splitSearch[0] === key;
                res.isPath = !res.isKey && splitPath[0] === key;

                if (res.isKey || res.isSearch || res.isPath) {
                    res.key = key;

                    if (res.isSearch && searchPath) {
                        res.split = this._searchDelimiter;
                        res.query = QueryParser._shiftAndTrim(splitSearch, res.split);
                        res.redirect = QueryParser._prepSearch(url, searchPath, res.query);
                    } else if (res.isPath) {
                        res.split = this._pathDelimiter;
                        res.path = QueryParser._shiftAndTrim(splitPath, res.split);
                        res.redirect = QueryParser._prepPath(url, res.path);
                    } else {
                        res.redirect = url;
                    }

                    return true;
                }

                if (key === '*') {
                    res.redirect = QueryParser._prepSearch(url, searchPath, query);
                }
            });
        }

        res.color = QueryParser._getColorFromUrl(this._commands, res.redirect);
        return res;
    }

    static _getColorFromUrl(commands, url) {
        const domain = new URL(url).hostname;

        return commands
            .filter(c => new URL(c[3]).hostname === domain)
            .map(c => c[5])[0] || null;
    }

    static _prepPath(url, path) {
        return QueryParser._stripUrlPath(url) + '/' + path;
    }

    static _prepSearch(url, searchPath, query) {
        if (!searchPath) return url;
        const baseUrl = QueryParser._stripUrlPath(url);
        const urlQuery = encodeURIComponent(query);
        searchPath = searchPath.replace('{}', urlQuery);
        return baseUrl + searchPath;
    }

    static _shiftAndTrim(arr, delimiter) {
        arr.shift();
        return arr.join(delimiter).trim();
    }

    static _stripUrlPath(url) {
        const parser = document.createElement('a');
        parser.href = url;
        return `${parser.protocol}//${parser.hostname}`;
    }
}

class Form {
    constructor(options) {
        this._formEl = $.el('#search-form');
        this._inputEl = $.el('#search-input');
        this.ss = $.el('#search-suggestions');
        this._suggestionEl = [];
        this._help = options.help;
        this._suggester = options.suggester;
        this._queryParser = options.queryParser;
        this._newTab = options.newTab;
        this._inputElVal = '';
        this._clearPreview = this._clearPreview.bind(this);
        this.show = this.show.bind(this);
        this._handleInput = this._handleInput.bind(this);
        this._handleKeydown = this._handleKeydown.bind(this);
        this._previewValue = this._previewValue.bind(this);
        this._submitForm = this._submitForm.bind(this);
        this._registerEvents();
        this._loadQueryParam();
    }

    hide() {
        $.bodyClassRemove('form');
        this._inputEl.value = '';
        this._inputElVal = '';
    }

    show() {
        $.bodyClassAdd('form');
        this._inputEl.focus();
    }

    _clearPreview() {
        this._previewValue(this._inputElVal);
        this._inputEl.focus();
    }

    _handleKeydown(e) {
        if ($.isUp(e) || $.isDown(e) || $.isRemove(e)) return;

        switch ($.key(e)) {
            case 'alt':
            case 'ctrl':
            case 'enter':
            case 'shift':
            case 'super':
                return;
            case 'escape':
                this.hide();
                return;
        }

        this.show();
    }

    _handleInput() {
        const newQuery = this._inputEl.value;
        const isHelp = newQuery === '?';
        const {
            isKey
        } = this._queryParser.parse(newQuery);
        this._inputElVal = newQuery;
        this._setBackgroundFromQuery(newQuery);
        if (!newQuery || isHelp) this.hide();
        if (isHelp) this._help.toggle();
        if (this._suggester) this._suggester.suggest(newQuery);
    }

    _loadQueryParam() {
        const q = new URLSearchParams(window.location.search).get('q');
        if (q) this._submitWithValue(q);
    }

    _previewValue(value) {
        this._inputEl.value = value;
        this._setBackgroundFromQuery(value);
    }

    _redirect(redirect) {
        if (this._newTab) window.open(redirect, '_blank');
        else window.location.href = redirect;
    }

    _registerEvents() {
        document.addEventListener('keydown', this._handleKeydown);
        this._inputEl.addEventListener('input', this._handleInput);
        this._formEl.addEventListener('submit', this._submitForm, false);

        if (this._suggester) {
            this._suggester.setOnClick(this._submitWithValue);
            this._suggester.setOnHighlight(this._previewValue);
            this._suggester.setOnUnhighlight(this._clearPreview);
        }
    }

    _setBackgroundFromQuery(query) {
        const {
            color
        } = this._queryParser.parse(query);;
        this._formEl.style.color = color;
    }

    _submitForm(e) {
        if (e) e.preventDefault();
        const query = this._inputEl.value;
        if (this._suggester) this._suggester.success(query);
        this.hide();
        this._redirect(this._queryParser.parse(query).redirect);
    }

    _submitWithValue(value) {
        this._inputEl.value = value;
        this._submitForm();
    }
}
const getHelp = () => {
    return new Help({
        commands: CONFIG.commands,
        newTab: CONFIG.newTab,
    });
};

const getInfluencers = () => {
    const availableInfluencers = {
        Default: DefaultInfluencer,
        DuckDuckGo: DuckDuckGoInfluencer,
    };

    return CONFIG.influencers.map(i => {
        return new availableInfluencers[i.name]({
            limit: i.limit,
            queryParser: getQueryParser(),
            defaultSuggestions: CONFIG.defaultSuggestions,
        });
    });
};

const getSuggester = () => {
    return new Suggester({
        influencers: getInfluencers(),
        limit: CONFIG.suggestionsLimit,
    });
};

const getQueryParser = () => {
    return new QueryParser({
        commands: CONFIG.commands,
        pathDelimiter: CONFIG.pathDelimiter,
        searchDelimiter: CONFIG.searchDelimiter,
    });
};

const getForm = () => {
    return new Form({
        help: getHelp(),
        newTab: CONFIG.newTab,
        queryParser: getQueryParser(),
        suggester: CONFIG.suggestions ? getSuggester() : false,
    });
};

new Clock({
    form: getForm(),
});