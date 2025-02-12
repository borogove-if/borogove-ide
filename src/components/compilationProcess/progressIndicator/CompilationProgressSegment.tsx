import React from "react";
import { observer } from "mobx-react";
import classnames from "classnames";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import BounceLoader from "react-spinners/BounceLoader";

import "react-circular-progressbar/dist/styles.css";
import { TiTick, TiTimes } from "react-icons/ti";

import "./CompilationProgressSegment.scss";

interface CompilationProgressSegmentProps {
    completed?: boolean;
    description?: string;
    failed?: boolean;
    header: string;
    isCurrentStage: boolean;
    percentage?: number | null;
}

/**
 * One segment in the progress indicator
 */
const CompilationProgressSegment: React.FC<CompilationProgressSegmentProps> =
    observer(
        ({
            completed = false,
            description,
            failed = false,
            header,
            percentage,
            isCurrentStage
        }) => (
            <li
                className={classnames("steps-segment", {
                    "is-active": isCurrentStage
                })}>
                <span
                    className={classnames([
                        "steps-marker",
                        {
                            "is-danger": failed && isCurrentStage
                        }
                    ])}>
                    {isCurrentStage &&
                        typeof percentage === "number" &&
                        percentage < 100 &&
                        !failed && (
                            <CircularProgressbar
                                value={percentage}
                                strokeWidth={40}
                                styles={buildStyles({
                                    pathColor: "#23d160",
                                    rotation: 0.5,
                                    strokeLinecap: "butt",
                                    trailColor: "#dbdbdb"
                                })}
                            />
                        )}
                    {failed && isCurrentStage && <TiTimes />}
                    {completed && <TiTick />}
                    {!completed &&
                        !failed &&
                        isCurrentStage &&
                        typeof percentage !== "number" && (
                            <BounceLoader size={20} />
                        )}
                </span>

                <div className="steps-content">
                    <p className="is-size-4">{header}</p>
                    {description}
                </div>
            </li>
        )
    );

export default CompilationProgressSegment;
