var List = React.createClass({
  getInitialState(){
    return {
      filterText: '',
      filterStatus: 'all'
    }
  },
  handleUserInput(filterText, filterStatus) {
    this.setState({
      filterText: (filterText !== null) ? filterText : this.state.filterText,
      filterStatus: (filterStatus !== null) ? filterStatus : this.state.filterStatus
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
  render(){
    var flights = [],
      filterText = this.props.filterText,
      filterStatus = this.props.filterStatus,
      statusMap = {
        all: '',
        active: 'active',
        finish: 'finish',
        planing: 'planing'
      };
    this.props.flights.forEach((flight) => {
      if (((flight.title.indexOf(filterText) !== -1
      || flight.place.indexOf(filterText) !== -1))
      && (flight.status.includes(statusMap[filterStatus]))) {
        flights.push(<FlightItem flight={flight} key={flight.title}/>);
      }
    })
    return (
      <div>
        <div>
          {flights}
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

var CAMPAIGN_FLIGHTS = [{
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
}];

ReactDOM.render(
  <List flights={CAMPAIGN_FLIGHTS} />,
  document.getElementById('cont')
);
