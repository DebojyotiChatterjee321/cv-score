
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { type MatchResult } from "@/types";

// Visualizes the match score between CV and JD
// Shows circular progress with animation and matching details
const MatchScore = ({ result }: { result: MatchResult }) => {
  return (
    <div className="glass p-6 rounded-xl animate-fade-in-up">
      <div className="flex flex-col md:flex-row md:items-center gap-8">
        <div className="w-32 h-32 mx-auto md:mx-0">
          <CircularProgressbar
            value={result.score * 10}
            text={`${result.score * 10}%`}
            styles={buildStyles({
              textSize: "1.5rem",
              pathColor: `rgba(22, 163, 74, ${result.score / 10})`,
              textColor: "#111827",
              trailColor: "#E5E7EB",
              pathTransition: "stroke-dashoffset 0.5s ease 0s",
            })}
          />
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-semibold mb-4">Match Analysis</h3>
          
          {/* Summary Section */}
          {result.recommendations.length > 0 && (
            <div className="mb-4">
              <p className="text-sm font-medium text-gray-800">Summary</p>
              <div className="mt-2 p-3 bg-gray-50 rounded-lg text-sm">
                {result.recommendations[0]}
              </div>
            </div>
          )}
          
          <div className="space-y-3">
            {/* Matched Skills Section */}
            <div>
              <p className="text-sm font-medium text-emerald-600">
                Matched Skills ({result.matchedSkills.length})
              </p>
              <div className="flex flex-wrap gap-2 mt-2">
                {result.matchedSkills.map((skill) => (
                  <span
                    key={skill}
                    className="px-2 py-1 bg-emerald-50 text-emerald-700 rounded-full text-xs"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
            
            {/* Missing Skills Section */}
            <div>
              <p className="text-sm font-medium text-rose-600">
                Missing Skills ({result.missingSkills.length})
              </p>
              <div className="flex flex-wrap gap-2 mt-2">
                {result.missingSkills.map((skill) => (
                  <span
                    key={skill}
                    className="px-2 py-1 bg-rose-50 text-rose-700 rounded-full text-xs"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MatchScore;
