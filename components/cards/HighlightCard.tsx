import React from "react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";

interface HighlightCardProps {
  title: string;
  description: string;
  amount?: string;
  deadline?: string;
  difficulty?: string;
  matchRate?: number;
  tags?: string[];
  badges?: Array<{ label: string; variant?: "default" | "new" | "urgent" | "verified" }>;
  savedItems?: Array<{ name: string; deadline: string }>;
  ctaText?: string;
  onCtaClick?: () => void;
  sourceUrl?: string;
  applicationUrl?: string;
  className?: string;
  size?: "default" | "large";
}

export const HighlightCard: React.FC<HighlightCardProps> = ({
  title,
  description,
  amount,
  deadline,
  difficulty,
  matchRate,
  tags = [],
  badges = [],
  savedItems = [],
  ctaText = "신청하기",
  onCtaClick,
  sourceUrl,
  applicationUrl,
  className = "",
  size = "default",
}) => {
  const isLarge = size === "large";

  const infoItems = [
    amount ? { label: "지원 금액", value: amount, valueClass: "text-text-primary" } : null,
    deadline ? { label: "마감일", value: deadline, valueClass: "text-warning" } : null,
    difficulty ? { label: "난이도", value: difficulty, valueClass: "text-text-secondary" } : null,
    matchRate !== undefined
      ? { label: "예상 승인율", value: `${matchRate}%`, valueClass: "text-secondary" }
      : null,
  ].filter(Boolean) as Array<{ label: string; value: string; valueClass: string }>;

  return (
    <Card className={`relative overflow-hidden h-full flex flex-col ${className}`}>
      <div className={`flex flex-col flex-1 ${isLarge ? "gap-3" : "gap-3"}`}>
        {/* 배지 영역 */}
        <div className="flex items-center gap-2 flex-wrap">
          {badges.map((badge, index) => (
            <Badge
              key={index}
              variant={badge.variant || "default"}
              className={isLarge ? "text-body-s px-3 py-1.5" : undefined}
            >
              {badge.label}
            </Badge>
          ))}
          {deadline && (
            <span
              className={`${isLarge ? "text-body-s" : "text-caption"} text-text-muted ml-auto`}
            >
              마감 {deadline}
            </span>
          )}
        </div>

        {/* 제목 */}
        <h3
          className={`${isLarge ? "text-heading-l" : "text-heading-m"} font-bold text-text-primary`}
        >
          {title}
        </h3>

        {/* 설명 */}
        <p
          className={`${
            isLarge ? "text-body-l text-text-secondary" : "text-body-s text-text-secondary"
          } ${isLarge ? "line-clamp-3" : "line-clamp-2"}`}
        >
          {description}
        </p>

        {/* 태그 */}
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {tags.map((tag, index) => (
              <span
                key={index}
                className={`${
                  isLarge ? "text-body-s" : "text-caption"
                } text-text-muted bg-badge px-2 py-1 rounded-md`}
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* 저장한 지원금 목록 */}
        {savedItems.length > 0 && (
          <div className="space-y-2 pt-2 border-t border-border">
            {savedItems.map((item, index) => (
              <div
                key={index}
                className="flex items-center justify-between py-1.5 px-2 rounded-lg hover:bg-badge/50 transition-colors"
              >
                <span className="text-body-s text-text-primary font-medium flex-1 truncate">
                  {item.name}
                </span>
                <span className="text-body-s text-warning font-medium ml-2 whitespace-nowrap">
                  {item.deadline}
                </span>
              </div>
            ))}
          </div>
        )}

        {/* 정보 섹션 */}
        {infoItems.length > 0 && (
          <div className={`${isLarge ? "pt-3" : "pt-2"} border-t border-border`}>
            {isLarge ? (
              <div className="space-y-3">
                {infoItems.map((item, index) => (
                  <div key={index} className="flex flex-col gap-1">
                    <span className="text-body-s text-text-muted">{item.label}</span>
                    <span
                      className={`${
                        item.label === "지원 금액" ? "text-body-l" : "text-body-m"
                      } font-semibold ${item.valueClass}`}
                    >
                      {item.value}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-2">
                {infoItems.map((item, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <span className="text-body-s text-text-muted">{item.label}</span>
                    <span
                      className={`text-body-m font-medium ${
                        item.label === "예상 승인율" ? "text-secondary" : "text-text-primary"
                      }`}
                    >
                      {item.value}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* CTA 버튼 */}
        <div className={`${isLarge ? "pt-3" : "pt-2"} mt-auto`}>
          <Button
            variant="primary"
            size={isLarge ? "lg" : "md"}
            onClick={(e) => {
              e.stopPropagation();
              if (onCtaClick) {
                onCtaClick();
              } else if (sourceUrl) {
                window.open(sourceUrl, "_blank", "noopener,noreferrer");
              } else if (applicationUrl) {
                window.open(applicationUrl, "_blank", "noopener,noreferrer");
              }
            }}
            className="w-full"
          >
            {ctaText}
          </Button>
        </div>
      </div>
    </Card>
  );
};

