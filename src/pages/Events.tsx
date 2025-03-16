import HomeLayout from "../components/HomeLayout";
import Event from "../components/events/EventDetailModal";
import EventList from "../components/events/EventList";

export default function Events() {
    return (
      <HomeLayout>
        {/* <Event label="proExplo intro" /> */}
        <EventList />
      </HomeLayout>
    );
  }