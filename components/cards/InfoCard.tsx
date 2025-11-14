import React from "react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";

interface InfoCardProps {
  title: string;
  category: string;
  description: string;
  tags?: string[];
  amount?: string;
  deadline?: string;
  difficulty?: string;
  matchRate?: number;
  sourceUrl?: string;
  applicationUrl?: string;
  onClick?: () => void;
}

export const InfoCard: React.FC<InfoCardProps> = ({
  title,
  category,
  description,
  tags = [],
  amount,
  deadline,
  difficulty,
  matchRate,
  sourceUrl,
  applicationUrl,
  onClick,
}) => {
  return (
    <Card onClick={onClick} className="h-full flex flex-col">
      <div className="flex flex-col gap-3 flex-1">
        {/* 헤더 */}
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1">
            <Badge variant="default" className="mb-2">
              {category}
            </Badge>
            <h3 className="text-heading-m font-bold text-text-primary line-clamp-2">
              {title}
            </h3>
          </div>
        </div>

        {/* 설명 */}
        <p className="text-body-s text-text-secondary line-clamp-2 flex-1">
          {description}
        </p>

        {/* 태그 */}
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {tags.map((tag, index) => (
              <span
                key={index}
                className="text-caption text-text-muted bg-badge px-2 py-1 rounded-md"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* 정보 */}
        <div className="space-y-2 pt-2 border-t border-border">
          {amount && (
            <div className="flex items-center justify-between">
              <span className="text-body-s text-text-muted">지원 금액</span>
              <span className="text-body-m font-semibold text-text-primary">
                {amount}
              </span>
            </div>
          )}
          {deadline && (
            <div className="flex items-center justify-between">
              <span className="text-body-s text-text-muted">마감일</span>
              <span className="text-body-s font-medium text-warning">{deadline}</span>
            </div>
          )}
          {difficulty && (
            <div className="flex items-center justify-between">
              <span className="text-body-s text-text-muted">난이도</span>
              <span className="text-body-s font-medium text-text-secondary">
                {difficulty}
              </span>
            </div>
          )}
          {matchRate !== undefined && (
            <div className="flex items-center justify-between">
              <span className="text-body-s text-text-muted">예상 승인율</span>
              <span className="text-body-s font-medium text-secondary">
                {matchRate}%
              </span>
            </div>
          )}
        </div>

        {/* 액션 버튼 */}
        <div className="flex gap-2 pt-2">
          {sourceUrl ? (
            <Button
              variant="ghost"
              size="sm"
              className="flex-1"
              onClick={(e) => {
                e.stopPropagation();
                window.open(sourceUrl, "_blank", "noopener,noreferrer");
              }}
            >
              상세 보기
            </Button>
          ) : (
            <Button variant="ghost" size="sm" className="flex-1" disabled>
              상세 보기
            </Button>
          )}
          <Button
            variant="primary"
            size="sm"
            className="flex-1"
            onClick={(e) => {
              e.stopPropagation();
              // 자격 진단 기능 (추후 구현)
            }}
          >
            자격 진단
          </Button>
        </div>
      </div>
    </Card>
  );
};

