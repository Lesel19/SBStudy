import SubjectList from "../components/SubjectList";
import Timer from "../components/Timer";
import { useTimer } from "../contexts/TimerContext";

function SubjectPage() {
  const { setSelectedSubject } = useTimer();

  return (
    <div style={styles.page}>
      <div style={styles.header}>
        <h1 style={styles.title}>📚 Session de travail</h1>
      </div>
      <div style={styles.content}>
        <SubjectList setSelectedSubject={setSelectedSubject} />
        <Timer />
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "linear-gradient(145deg, #f5f0ff 0%, #ede9fe 100%)",
    padding: "20px",
    paddingBottom: "80px",
  },
  header: {
    marginBottom: "20px",
  },
  title: {
    fontSize: "28px",
    fontWeight: "700",
    color: "#1f2937",
    textAlign: "center",
  },
  content: {
    maxWidth: "500px",
    margin: "0 auto",
    display: "flex",
    flexDirection: "column",
    gap: "20px",
  },
};

export default SubjectPage;