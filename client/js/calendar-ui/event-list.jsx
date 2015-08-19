/**
 * Created by Łukasz Kwasek on 8/19/15.
 */

/**
 * Events container:
 *
 *     <EventList events={Array} />
 *
 *     @property events {Array} an array of details in the form {start: int, end: int, groupSize: int, column: int}:
 *     - start: beginning of the event
 *     - end: end of the event
 *     - groupSize: how many columns there are in the group which this event belongs to
 *     - column: index of the column in the group
 */
var EventList = React.createClass({
    render: function () {

        var eventList = [];

        if (this.props.events) {
            eventList = this.props.events.map(function (e) {
                return (
                    <Event start={e.start} end={e.end} groupSize={e.groupSize} column={e.column}/>
                );
            });
        }

        return (
            <div className="calendar-event-list">
                {eventList}
            </div>
        );
    }
});