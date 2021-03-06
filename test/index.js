var chai = require('chai');
var expect = chai.expect;

var React = require('../src/index');

describe('React', function () {
    describe('Component', function () {
        it('should be a function', function () {
            expect(React.Component).to.be.a('function');
        });

        it('should transform params to fields', function () {
            var props = {a: 1};
            var context = {b: 2};

            var component = new React.Component(props, context);

            expect(component.props).to.equal(props);
            expect(component.context).to.equal(context);
        });
    });

    describe('PureComponent', function () {
        it('should be a function', function () {
            expect(React.PureComponent).to.be.a('function');
        });

        it('should transform params to fields', function () {
            var props = {a: 1};
            var context = {b: 2};

            var component = new React.PureComponent(props, context);

            expect(component.props).to.equal(props);
            expect(component.context).to.equal(context);
        });
    });

    describe('createClass', function () {
        it('should be a function', function () {
            expect(React.createClass).to.be.a('function');
        });

        it('should return class', function () {
            expect(React.createClass({})).to.be.a('function');
        });

        it('should transfer method from decl to class prototype', function () {
            var decl = {
                render: function () {}
            };
            var instance = new (React.createClass(decl))();

            expect(instance.render).to.equal(decl.render);
        });

        it('should transfer method and property from decl.statics to class', function () {
            var decl = {
                statics: {
                    someProperty: 1,
                    someMethod: function () {}
                }
            };
            var SomeClass = React.createClass(decl);

            expect(SomeClass.someProperty).to.equal(decl.statics.someProperty);
            expect(SomeClass.someMethod).to.equal(decl.statics.someMethod);
        });

        it('should execute getDefaultProps method and put result to static component field', function () {
            var defaultProps = {a: 1};
            var Component = React.createClass({
                getDefaultProps: function () {
                    return defaultProps;
                }
            });

            expect(Component.defaultProps).to.equal(defaultProps);
        });

        it('should mix all mixins to prototype', function () {
            var mixin = {someMethod: function () {}};
            var Component = React.createClass({mixins: [mixin]});

            expect(Component.prototype.someMethod).to.equal(mixin.someMethod);
        });

        it('should put getInitialState result to instance state', function () {
            var Component = React.createClass({
                getInitialState: function () {
                    return {a: 1};
                }
            });
            var instance = new Component();

            expect(instance.state.a).to.equal(1);
        });

        it('should call getInitialState only after props received', function () {
            var Component = React.createClass({
                getInitialState: function () {
                    return {b: this.props.a};
                }
            });
            var instance = new Component({a: 1});

            expect(instance.state.b).to.equal(1);
        });

        it('should change state after setState called', function () {
            var instance = new (React.createClass({}))();
            instance.setState({b: 2});

            expect(instance.state.b).to.equal(2);
        });
    });

    describe('createElement', function () {
        it('should be a function', function () {
            expect(React.createElement).to.be.a('function');
        });

        it('should transfer to element all props', function () {
            var element = React.createElement('div', {a: 1, b: 2});

            expect(element.props.a).to.equal(1);
            expect(element.props.b).to.equal(2);
        });

        it('should mix default props to props', function () {
            var Component = React.createClass({
                getDefaultProps: function () {
                    return {a: 1};
                }
            });

            var element = React.createElement(Component, {b: 2});

            expect(element.props.a).to.equal(1);
            expect(element.props.b).to.equal(2);
        });

        it('should put child to props', function () {
            var element = React.createElement('div', null, 'child');
            expect(element.props.children).to.equal('child');
        });

        it('should put children to props', function () {
            var element = React.createElement('div', null, 'first child', 'second child');

            expect(element.props.children[0]).to.equal('first child');
            expect(element.props.children[1]).to.equal('second child');
        });

        it('should put all arguments starting from the second to children', function () {
            var element = React.createElement('div', null, 'first child', 'second child', 'third child');
            expect(element.props.children.length).to.equal(3);

            expect(element.props.children[0]).to.equal('first child');
            expect(element.props.children[1]).to.equal('second child');
            expect(element.props.children[2]).to.equal('third child');
        });

        it('should not overwrite children from props in case of third argument is undefined', function () {
            var element = React.createElement('div', {children: 'child'});
            expect(element.props.children).to.equal('child');
        });
    });

    describe('cloneElement', function () {
        it('should be a function', function () {
            expect(React.cloneElement).to.be.a('function');
        });

        it('should transfer to element all props', function () {
            var originalElement = React.createElement('div', {a: 1, b: 2});
            var element = React.cloneElement(originalElement);

            expect(element.props.a).to.equal(1);
            expect(element.props.b).to.equal(2);
        });

        it('should mix props from original element and from params', function () {
            var originalElement = React.createElement('div', {a: 1, b: 2});
            var element = React.cloneElement(originalElement, {b: 3, c: 4});

            expect(element.props.a).to.equal(1);
            expect(element.props.b).to.equal(3);
            expect(element.props.c).to.equal(4);
        });

        it('should replace existing children', function () {
            var originalElement = React.createElement('div', null, 'original child');
            var element = React.cloneElement(originalElement, null, 'child');

            expect(element.props.children).to.equal('child');
        });

        it('should put all arguments starting from the second to children', function () {
            var originalElement = React.createElement('div', null);
            var element = React.cloneElement(originalElement, null, 'first child', 'second child', 'third child');

            expect(element.props.children.length).to.equal(3);

            expect(element.props.children[0]).to.equal('first child');
            expect(element.props.children[1]).to.equal('second child');
            expect(element.props.children[2]).to.equal('third child');
        });

        it('should retain children from original element', function () {
            var originalElement = React.createElement('div', null, 'child');
            var element = React.cloneElement(originalElement);

            expect(element.props.children).to.equal('child');
        });
    });
});
