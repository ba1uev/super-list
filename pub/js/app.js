var List = React.createClass({
  getInitialState(){
    return {
      filterText: '',
      filterStatus: 'all',
      pagination: this.props.pagination,
      range: this.props.range
    }
  },
  handleUserInput(filterText, filterStatus) {
    this.setState({
      filterText: (filterText !== null) ? filterText : this.state.filterText,
      filterStatus: (filterStatus !== null) ? filterStatus : this.state.filterStatus
    })
  },
  handleGetMoreItems(){
    this.setState({
      pagination: null
    })
  },
  handleRangeChange(range){
    console.log('changet to ', range);
    this.setState({
      range: range
    })
  },
  render(){
    return (
      <div>
        <h1>Flight list</h1>

        <RangeBar
          range={this.state.range}
          onUserInput={this.handleRangeChange}/>

        <FilterBar
          filterStatus={this.state.filterStatus}
          onUserInput={this.handleUserInput} />

        <SearchBar
          filterText={this.state.filterText}
          onUserInput={this.handleUserInput}/>

        { this.state.range ?
          <HeaderedList
            data={this.props.data}
            pagination={this.state.pagination}
            getMoreItems={this.handleGetMoreItems}
            filterText={this.state.filterText}
            filterStatus={this.state.filterStatus}/>
          :
          <FlightList
            flights={this.props.data}
            pagination={this.state.pagination}
            getMoreItems={this.handleGetMoreItems}
            filterText={this.state.filterText}
            filterStatus={this.state.filterStatus}/>
         }
      </div>
    );
  }
});

var RangeBar = React.createClass({
  handleChange(e){
    e.preventDefault();
    this.props.onUserInput(e.target.dataset.range);
  },
  render(){
    var range = this.props.range;
    if (range) {
      return (
        <div>
          Показываем: {'  '}
          <a href="" data-range="campaign" onClick={this.handleChange}>по кампании</a>,{'  '}
          <a href="" data-range="client" onClick={this.handleChange}>по клиенту</a>
          <hr/>
        </div>
      )
    } else {
      return false
    }
  }
})

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
          <hr/>
      </form>
    )
  }
});

var HeaderedList = React.createClass({
  render(){
    return (
      <div>
        <ListHeader />
        <FlightList
          flights={this.props.data}
          filterText={this.props.filterText}
          filterStatus={this.props.filterStatus}/>
      </div>
    )
  }
})

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

var ListHeader = React.createClass({
  render(){
    return (
      <div>
        <h4>Заголовок списка</h4>
      </div>
    )
  }
})

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


ReactDOM.render(
  <List data={DATA} pagination={3} range={'client'}/>,
  document.getElementById('cont')
);
