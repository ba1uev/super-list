var List = React.createClass({
  getInitialState(){
    return {
      filterText: '',
      filterStatus: 'all',
      pagination: this.props.pagination,
      range: this.props.range,
      data: this.props.range ? this.dataParse(this.props.data, this.props.range) : this.props.data
    }
  },
  handleUserInput(filterText, filterStatus) {
    this.setState({
      filterText: (filterText !== null) ? filterText : this.state.filterText,
      filterStatus: (filterStatus !== null) ? filterStatus : this.state.filterStatus
    })
  },
  dataParse(data, range){
    var result;
    if (range === 'client') {
      console.log('dataparse client');
      result = this.dataParseClient(data);
    }
    if (range === 'campaign') {
      console.log('dataparse campaign');
      result = this.dataParseCampaign(data);
    }
    return result;
  },
  dataParseClient(data) {
    var arr = [],
      map = [];
    data.campaigns.items.forEach((item, i) => {
      var user = item.user;
      var flights = item.flights_list.items;
      arr.push({
        user: user,
        flights: flights
      });
    });
    arr.forEach((item, i) => {
      let userId = item.user.id;
      let index = map.indexOf(userId);
      if (index === -1) {
        map.push(userId);
      } else {
        arr[index].flights = arr[index].flights.concat(arr[i].flights);
        arr.splice(i,1);
      }
    });
    return arr
  },
  dataParseCampaign(data){
    var result = [];
    data.campaigns.items.forEach((c,i) => {
      result.push({
        campaign: c,
        flights: c.flights_list.items
      })
    });
    return result
  },
  handleRangeChange(range){
    this.setState({
      range: range,
      data: range ? this.dataParse(this.props.data, range) : this.props.data
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
            range={this.state.range}
            data={this.state.data}
            pagination={this.state.pagination}
            filterText={this.state.filterText}
            filterStatus={this.state.filterStatus}/>
          :
          <FlightList
            flights={this.state.data}
            pagination={this.state.pagination}
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
          <a href="" className={range === 'campaign' ? 'active' : null} data-range="campaign" onClick={this.handleChange}>по кампании</a>,{'  '}
          <a href="" className={range === 'client' ? 'active' : null} data-range="client" onClick={this.handleChange}>по клиенту</a>
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
    var fs = this.props.filterStatus;
    return (
      <div>
        <a href="" className={fs === 'all' ? 'active' : null} data-filter="all" onClick={this.handleChange}>Все</a>{'  '}
        <a href="" className={fs === 'active' ? 'active' : null} data-filter="active" onClick={this.handleChange}>Активные</a>{'  '}
        <a href="" className={fs === 'planing' ? 'active' : null} data-filter="planing" onClick={this.handleChange}>Планируемые</a>{'  '}
        <a href="" className={fs === 'finish' ? 'active' : null} data-filter="finish" onClick={this.handleChange}>Закрытые</a>
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
    var HeaderedList = [];
    this.props.data.forEach((range) => {
      let headerData = (this.props.range === 'campaign') ? range.campaign : range.user;
      // let headerData = range.campaign;
      let listData = range.flights;
      HeaderedList.push(
        <div>
          <ListHeader
            data={headerData}
            range={this.props.range}
            />

          <FlightList
            flights={listData}
            filterText={this.props.filterText}
            pagination={this.props.pagination}
            filterStatus={this.props.filterStatus}
            getMoreItems={this.getMoreItems}/>
        </div>
      );
    });
    return (
      <div>
        {HeaderedList}
      </div>
    )
  }
})

var FlightList = React.createClass({
  getInitialState(){
    return {
      pagination: this.props.pagination
    }
  },
  getMoreItemsAction(){
    this.setState({
      pagination: null
    });
  },
  render(){
    var flights = [],
      pagination = this.state.pagination,
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
    var range = this.props.range;
    if (!range) {
      return false
    };
    if (range === 'client') {
      return (
        <div>
          <h4 style={{backgroundColor: 'hotpink'}}>{this.props.data.id}</h4>
          <p style={{color: 'gray'}}>SHAPKA для клиента</p>
        </div>
      )
    };
    if (range === 'campaign') {
      return (
        <div>
          <h4 style={{backgroundColor: 'red'}}>{this.props.data.title}</h4>
          <p style={{color: 'gray'}}>Шапка для кампании</p>
        </div>
      )
    };
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
// TODO

// DATA_by_client / DATA_by_campaign
// showMore fix
//

// =======================================

ReactDOM.render(
  <List data={atd_data_new} pagination={3} range={'client'}/>,
  document.getElementById('cont')
);
