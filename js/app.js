/**
 * Created file.
 * User: iDokki
 * Date: 14.11.2016
 * Time: 19:50
 */

'use strict';

window.ee = new EventEmitter();

var Article = React.createClass({
    propTypes: {
        data: React.PropTypes.shape({
            author: React.PropTypes.string.isRequired,
            text: React.PropTypes.string.isRequired,
            bigText: React.PropTypes.string.isRequired
        })
    },
    getInitialState: function() {
        return {
            visible: false,
            rating: 0
        };
    },
    readmoreClick: function(e) {
        e.preventDefault();

        this.setState({visible: true}, function() {
            console.log('Состояние изменилось - visible: true');
        });
    },
    render: function(){
        var author = this.props.data.author,
            text = this.props.data.text,
            bigText = this.props.data.bigText,
            visible = this.state.visible;

        return (
            <div className="article">
                <p className="news__author">{author}:</p>
                <p className="news__text">{text}</p>
                <a href="#" onClick={this.readmoreClick} className={'news__readmore ' + (visible ? 'none': '')}>Подробнее</a>
                <p className={'news__text-big ' + (visible ? '': 'none')}>{bigText}</p>
            </div>
        );
    }
});

var News = React.createClass({
        propTypes: {
            data: React.PropTypes.array.isRequired
        },
        getInitialState: function() {
            return {
                counter: 0
            };
        },
        onTotalNewsClick: function(e) {
            e.preventDefault();

            this.setState({counter: ++this.state.counter}, function() {
                console.log('Состояние изменилось - counter: ' + this.state.counter);
            });
        },
        render: function() {
            var data = this.props.data,
                newsTemplate;

            if(data.length)
                newsTemplate = data.map(function(item, index) {
                    return (
                        <Article data={item} key={index} />
                    )
                });
            else
                newsTemplate = <p>К сожалению новостей нет</p>;

            return (
                <div className="news">
                    {newsTemplate}
                    {data.length != 0 ? <strong onClick={this.onTotalNewsClick} className="news__count">Всего новостей: {data.length}</strong> : ''}
                </div>
            );
        }
    });

var Add = React.createClass({
    getInitialState: function() { //устанавливаем начальное состояние (state)
        return {
            agreeNotChecked: true,
            authorIsEmpty: true,
            textIsEmpty: true
        };
    },
    componentDidMount: function() {
        ReactDOM.findDOMNode(this.refs.author).focus();
    },
    onBtnClickHandler: function(e) {
        var author = ReactDOM.findDOMNode(this.refs.author),
            text = ReactDOM.findDOMNode(this.refs.text);

        window.ee.emit('News.add', [{
            author: author.value,
            text: text.value,
            bigText: '...'
        }]);

        text.value = '';

        this.setState({textIsEmpty: true});

        e.preventDefault();
    },
    onFieldChange: function(fieldName, e) {
        this.setState({[fieldName]:
            /** @namespace e.target.value */
            !e.target.value.trim()
        });
    },
    onCheckRuleClick: function() {
        this.setState({agreeNotChecked: !this.state.agreeNotChecked});
    },
    render: function() {
        return (
            <form className='add cf'>
                <input
                    type='text'
                    className='add__author'
                    defaultValue=''
                    placeholder='Ваше имя'
                    ref='author'
                    onChange={this.onFieldChange.bind(this, 'authorIsEmpty')}
                />
                <textarea
                    className='add__text'
                    defaultValue=''
                    placeholder='Текст новости'
                    ref='text'
                    onChange={this.onFieldChange.bind(this, 'textIsEmpty')}
                ></textarea>
                <label className='add__checkrule'>
                    <input type='checkbox' defaultChecked={false} ref='checkrule' onChange={this.onCheckRuleClick} />Я согласен с правилами
                </label>
                <button
                    className='add__btn'
                    onClick={this.onBtnClickHandler}
                    ref='alert_button'
                    disabled={this.state.agreeNotChecked || this.state.authorIsEmpty || this.state.textIsEmpty}
                >
                    Добавить новость
                </button>
            </form>
        );
    }
});

var newsObj = [
    {author: 'Саша Печкин', text: 'В четверг, четвертого числа...', bigText: 'в четыре с четвертью часа четыре чёрненьких чумазеньких чертёнка чертили чёрными чернилами чертёж.'},
    {author: 'Просто Вася', text: 'Считаю, что $ должен стоить 35 рублей!', bigText: 'А евро 42!'},
    {author: 'Гость', text: 'Бесплатно. Скачать. Лучший сайт - http://localhost:3000', bigText: 'На самом деле платно, просто нужно прочитать очень длинное лицензионное соглашение'}
];

var App = React.createClass({
    getInitialState: function() {
        return {
            news: newsObj
        };
    },
    componentDidMount: function() {
        var self = this;

        window.ee.addListener('News.add', function(item) {
            var nextNews = item.concat(self.state.news);

            self.setState({news: nextNews});
        });
    },
    componentWillUnmount: function() {
        window.ee.removeListener('News.add');
    },
    render: function(){
        console.log('render');

        return (
            <div className="app">
                <Add />
                <h3>Новости</h3>
                <News data={this.state.news} />
            </div>
        );
    }
});

ReactDOM.render(
    <App />,
    document.getElementById('root')
);