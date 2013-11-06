/**
 * Author: Christina
 *
 * Builds dialog in the specified node
 */
epam.madracer.dialog = (function () {
    var DialogBox = function (parent) {
        this.parent = parent;
        this.build();
    }
    DialogBox.prototype = {
        build: function () {
            var parent = this.parent || document.body;
            this.node = this.createTag('div', {id: 'dialog'});
            this.content = this.createTag('div', {'class': 'dialog-content'})
            this.node.appendChild(this.content);
            parent.appendChild(this.node);
        },
        createTag: function (tagName, attrs) {
            var node = document.createElement(tagName);
            for (var key in attrs) {
                node.setAttribute(key, attrs[key]);
            }
            return node;
        },
        show: function () {
            this.node.className = 'open';
        },
        hide: function () {
            this.node.className = '';
        },
        isShown: function () {
            return this.node.className === 'open';
        },
        /**
         * Adds the children images items
         */
        setData: function (header, data) {
            var block = this.createTag('div');

            var h3 = this.createTag('h3');
            h3.innerHTML = header;

            var list = this.createTag('ul');
            for (var prop in data) {
                var node = this.createTag('li', {'data-model': prop});
                var img = this.createTag('img', {src: data[prop].src, width: 80, height: 36});
                node.appendChild(img);
                list.appendChild(node);
            }

            block.appendChild(h3);
            block.appendChild(list);
            this.content.appendChild(block);
        }
    };

    return {
        create: function (parent) {
            return new DialogBox(parent);
        }
    };
})();