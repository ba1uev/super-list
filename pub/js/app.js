var List = React.createClass({
  getInitialState(){
    return {
      filterText: '',
      filterStatus: 'all',
      pagination: this.props.pagination
    }
  },
  handleUserInput(filterText, filterStatus) {
    this.setState({
      filterText: (filterText !== null) ? filterText : this.state.filterText,
      filterStatus: (filterStatus !== null) ? filterStatus : this.state.filterStatus
    });
  },
  handleGetMoreItems(){
    this.setState({
      pagination: null
    });
  },
  render(){
    return (
      <div>
        <h1>Flight list</h1>

        <SearchBar
          filterText={this.state.filterText}
          onUserInput={this.handleUserInput}/>

        <FilterBar
          filterStatus={this.state.filterStatus}
          onUserInput={this.handleUserInput} />

        <FlightList
          flights={this.props.flights}
          pagination={this.state.pagination}
          getMoreItems={this.handleGetMoreItems}
          filterText={this.state.filterText}
          filterStatus={this.state.filterStatus}/>
      </div>
    );
  }
});

var SearchBar = React.createClass({
  handleChange: function() {
    this.props.onUserInput(
      this.refs.filterTextInput.value,
      null
    );
  },
  render(){
    return (
      <form>
        <input
          type="text"
          placeholder="Search..."
          value={this.props.filterText}
          ref="filterTextInput"
          onChange={this.handleChange}/>
      </form>
    )
  }
});

var FilterBar = React.createClass({
  handleChange(e){
    e.preventDefault();
    this.props.onUserInput(
      null,
      e.target.dataset.filter
    );
  },
  render(){
    return (
      <div>
        <a href="" data-filter="all" onClick={this.handleChange}>Все</a>{'  '}
        <a href="" data-filter="active" onClick={this.handleChange}>Активные</a>{'  '}
        <a href="" data-filter="planing" onClick={this.handleChange}>Планируемые</a>{'  '}
        <a href="" data-filter="finish" onClick={this.handleChange}>Закрытые</a>
      </div>
    )
  }
});

var FlightList = React.createClass({
  getMoreItemsAction(){
    this.props.getMoreItems();
  },
  render(){
    var flights = [],
      pagination = this.props.pagination,
      filterText = this.props.filterText,
      filterStatus = this.props.filterStatus,
      statusMap = {
        all: '',
        active: 'active',
        finish: 'finish',
        planing: 'planing'
      },
      itemCount = 0;
    this.props.flights.forEach((flight) => {
      if (((flight.title.indexOf(filterText) !== -1
      || flight.place.indexOf(filterText) !== -1))
      && (flight.status.includes(statusMap[filterStatus]))) {
        if (pagination) {
          if (itemCount < pagination) {
            flights.push(<FlightItem flight={flight} key={flight.title}/>);
            ++itemCount;
          } else {
            return
          }
        } else {
          flights.push(<FlightItem flight={flight} key={flight.title}/>);
        }
      }
    })
    return (
      <div>
        <div>
          {flights}
          {pagination ? <button style={{margin: 'auto', postion: 'relative'}} onClick={this.getMoreItemsAction}>More</button> : null}
        </div>
      </div>
    )
  }
});

var FlightItem = React.createClass({
  render(){
    var title = this.props.flight.title;
    var shows = this.props.flight.shows;
    var status = this.props.flight.status;
    var place = this.props.flight.place;
    // FIXME: рендерить содержимое итема БЕЗ пробелов и переносов строк
    return (
      <div className="list-item">
        <hr />
        <h5>{title}</h5>
        Shows: {shows}
        <br />
        Status: {status}
        <br />
        Place: {place}
      </div>
    )
  }
});


// =======================================

var DATA = [{
  id: 1,
  title: 'первый',
  place: 'афиша',
  status: 'active',
  shows: 2134
}, {
  id: 2,
  title: 'пир на весь мир',
  place: 'рамблер',
  status: 'finish',
  shows: 213233134
}, {
  id: 3,
  title: 'персона',
  place: 'афиша',
  status: 'active',
  shows: 11102134
}, {
  id: 4,
  title: 'первоочередный',
  place: 'рамблер',
  status: 'planing',
  shows: 999920
}, {
  id: 5,
  title: 'перевозка',
  place: 'рамблер',
  status: 'finish',
  shows: 666
}, {
  id: 6,
  title: 'закрыто',
  place: 'афиша',
  status: 'finish',
  shows: 777
}, {
  id: 7,
  title: 'перестало быть крутым',
  place: 'рамблер',
  status: 'finish',
  shows: 6696
}];

ReactDOM.render(
  <List flights={DATA} pagination={3}/>,
  document.getElementById('cont')
);
