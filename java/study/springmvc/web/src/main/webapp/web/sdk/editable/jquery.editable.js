// jQuery.editable.js v1.1.2
// http://shokai.github.io/jQuery.editable
// (c) 2012-2015 Sho Hashimoto <hashimoto@shokai.org>
// The MIT License
(function ($) {
    var escape_html = function (str) {
        return str.replace(/</gm, '&lt;').replace(/>/gm, '&gt;');
    };
    var unescape_html = function (str) {
        return str.replace(/&lt;/gm, '<').replace(/&gt;/gm, '>');
    };

    $.fn.editable = function (event, options) {
        if (typeof event === 'string') {
            var trigger = this;
            var action = event;
            var type = 'input';
        }
        else if (typeof event === 'object') {
            var trigger = event.trigger || this;
            if (typeof trigger === 'string') trigger = $(trigger);
            var action = event.action || 'click';
            var type = event.type || 'input';
        }
        else {
            throw('Argument Error - jQuery.editable("click", function(){ ~~ })');
        }

        var target = this;
        var edit = {};
        var self = this;

        this.options = options  || {
            beforeEdit: function(inputBox){return true;},
            beforeEnd: function(inputBox){return true;},
            endEdit: function(data){},
            cancelEdit: function(data){},
            placeHolder: ""
        };

        edit.start = function (e) {
            trigger.unbind(action === 'clickhold' ? 'mousedown' : action);
            if (trigger !== target) trigger.hide();
            var old_value = (
                type === 'textarea' ?
                    target.text().replace(/<br( \/)?>/gm, '\n').replace(/&gt;/gm, '>').replace(/&lt;/gm, '<') :
                    target.text()
            ).replace(/^\s+/, '').replace(/\s+$/, '');

            var input = type === 'textarea' ? $('<textarea>') : $('<input type="text">');
            input.val(old_value)
                /*.css('width', type === 'textarea' ? '100%' : target.width() + target.height())*/
                //.css('font-size', '100%')
                .css('margin', 0)
                .attr('id', 'editable_' + (new Date() * 1)).
            addClass('editable');
            if (type === 'textarea') input.css('height', target.height());
            input.attr("placeholder", self.options.placeHolder);

            var finish = function () {
                if (self.options.beforeEnd(input) === false){
                    return;
                }

                var result = input.val().replace(/^\s+/, '').replace(/\s+$/, '');
                var html = escape_html(result);
                if (type === 'textarea') html = html.replace(/[\r\n]/gm, '<br />');
                target.html(html);
                self.options.endEdit({value: result, target: target, old_value: old_value});
                edit.register();
                if (trigger !== target) trigger.show();
            };

            var cancel = function(){
                target.html(old_value);
                edit.register();
                if (trigger !== target) trigger.show();
                self.options.cancelEdit({target: target});
            };

            input.blur(finish);

            if (type === 'input') {
                input.keydown(function (e) {
                    e.stopPropagation();
                    if (e.keyCode === 13){
                        finish();
                    }
                    else if (e.keyCode == 27){
                        cancel();
                    }
                });
            }

            target.html(input);
            input.focus();
            self.options.beforeEdit(input);

            if (e){
                e.stopPropagation();
            }
        };

        edit.register = function () {
            if (action === 'clickhold') {
                var tid = null;
                trigger.bind('mousedown', function (e) {
                    tid = setTimeout(function () {
                        edit.start(e);
                    }, 500);
                });
                trigger.bind('mouseup mouseout', function (e) {
                    clearTimeout(tid);
                });
            }
            else {
                trigger.bind(action, edit.start);
            }
        };
        edit.register();

        return this;
    };
})(jQuery);
