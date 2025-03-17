import HomeLayout from "../components/HomeLayout";
import EventList from "../components/events/EventList";

export default function Events() {
    return (
      <HomeLayout>
        {/* <Event label="proExplo intro" /> */}
        <EventList />
      </HomeLayout>
    );
  }