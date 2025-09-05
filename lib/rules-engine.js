import { readFileSync } from 'fs';
import path from 'path';

export class RulesEngine {
  constructor() {
    this.rules = new Map();
    this.violations = [];
    this.loadDefaultRules();
  }

  loadDefaultRules() {
    // Enterprise coding standards and security rules
    this.addRule({
      id: 'security-no-hardcoded-secrets',
      name: 'No Hardcoded Secrets',
      category: 'security',
      severity: 'critical',
      description: 'Detects hardcoded passwords, API keys, and sensitive data',
      pattern: /(password|secret|key|token)\s*[:=]\s*['"][^'"]*['"]/gi,
      action: 'block',
      enterprise: true
    });

    this.addRule({
      id: 'compliance-gdpr-data-handling',
      name: 'GDPR Data Handling',
      category: 'compliance',
      severity: 'high',
      description: 'Ensures proper data handling for GDPR compliance',
      pattern: /(personal.*data|user.*information|pii)/gi,
      action: 'warn',
      enterprise: true
    });

    this.addRule({
      id: 'performance-no-nested-loops',
      name: 'Performance - Nested Loops',
      category: 'performance',
      severity: 'medium',
      description: 'Flags deeply nested loops that may impact performance',
      pattern: /for\s*\([^}]*for\s*\([^}]*for\s*\(/gi,
      action: 'warn',
      enterprise: false
    });

    this.addRule({
      id: 'maintainability-large-functions',
      name: 'Large Function Detection',
      category: 'maintainability',
      severity: 'low',
      description: 'Identifies functions that may be too large',
      pattern: /function\s+\w+\s*\([^)]*\)\s*{[^}]{1000,}/gi,
      action: 'info',
      enterprise: false
    });

    this.addRule({
      id: 'security-sql-injection',
      name: 'SQL Injection Prevention',
      category: 'security',
      severity: 'critical',
      description: 'Detects potential SQL injection vulnerabilities',
      pattern: /(\$\{.*\}|`.*\$\{.*\}`)/gi,
      action: 'block',
      enterprise: true
    });

    this.addRule({
      id: 'enterprise-logging',
      name: 'Enterprise Logging Standards',
      category: 'compliance',
      severity: 'medium',
      description: 'Ensures proper logging for enterprise audit trails',
      pattern: /console\.(log|error|warn)/gi,
      action: 'warn',
      enterprise: true
    });
  }

  addRule(rule) {
    this.rules.set(rule.id, {
      ...rule,
      enabled: true,
      created: new Date().toISOString(),
      lastModified: new Date().toISOString()
    });
  }

  removeRule(ruleId) {
    return this.rules.delete(ruleId);
  }

  enableRule(ruleId) {
    if (this.rules.has(ruleId)) {
      this.rules.get(ruleId).enabled = true;
      return true;
    }
    return false;
  }

  disableRule(ruleId) {
    if (this.rules.has(ruleId)) {
      this.rules.get(ruleId).enabled = false;
      return true;
    }
    return false;
  }

  validateCode(code, filePath = 'unknown') {
    const violations = [];
    const enabledRules = Array.from(this.rules.values()).filter(rule => rule.enabled);

    for (const rule of enabledRules) {
      const matches = code.match(rule.pattern);
      if (matches) {
        violations.push({
          ruleId: rule.id,
          ruleName: rule.name,
          category: rule.category,
          severity: rule.severity,
          description: rule.description,
          file: filePath,
          line: this.findLineNumber(code, matches[0]),
          matches: matches.length,
          action: rule.action,
          enterprise: rule.enterprise,
          timestamp: new Date().toISOString()
        });
      }
    }

    this.violations.push(...violations);
    return violations;
  }

  validateFile(filePath) {
    try {
      const code = readFileSync(filePath, 'utf-8');
      return this.validateCode(code, filePath);
    } catch (error) {
      return [{
        ruleId: 'file-read-error',
        ruleName: 'File Read Error',
        category: 'system',
        severity: 'error',
        description: `Could not read file: ${error.message}`,
        file: filePath,
        action: 'error',
        enterprise: false,
        timestamp: new Date().toISOString()
      }];
    }
  }

  validateProject(projectPath) {
    const violations = [];
    const extensions = ['.js', '.ts', '.jsx', '.tsx', '.py', '.java', '.cpp', '.c'];

    // Recursively scan project files
    const scanDirectory = (dirPath) => {
      const items = require('fs').readdirSync(dirPath, { withFileTypes: true });

      for (const item of items) {
        const fullPath = path.join(dirPath, item.name);

        if (item.isDirectory() && !item.name.startsWith('.') && item.name !== 'node_modules') {
          scanDirectory(fullPath);
        } else if (item.isFile() && extensions.some(ext => item.name.endsWith(ext))) {
          const fileViolations = this.validateFile(fullPath);
          violations.push(...fileViolations);
        }
      }
    };

    try {
      scanDirectory(projectPath);
    } catch (error) {
      violations.push({
        ruleId: 'project-scan-error',
        ruleName: 'Project Scan Error',
        category: 'system',
        severity: 'error',
        description: `Could not scan project: ${error.message}`,
        file: projectPath,
        action: 'error',
        enterprise: false,
        timestamp: new Date().toISOString()
      });
    }

    return violations;
  }

  findLineNumber(code, match) {
    const lines = code.split('\n');
    for (let i = 0; i < lines.length; i++) {
      if (lines[i].includes(match)) {
        return i + 1;
      }
    }
    return 0;
  }

  getViolations(filters = {}) {
    let filtered = [...this.violations];

    if (filters.severity) {
      filtered = filtered.filter(v => v.severity === filters.severity);
    }

    if (filters.category) {
      filtered = filtered.filter(v => v.category === filters.category);
    }

    if (filters.enterprise !== undefined) {
      filtered = filtered.filter(v => v.enterprise === filters.enterprise);
    }

    return filtered;
  }

  getRulesSummary() {
    const summary = {
      total: this.rules.size,
      enabled: 0,
      disabled: 0,
      byCategory: {},
      bySeverity: {},
      enterprise: 0
    };

    for (const rule of this.rules.values()) {
      if (rule.enabled) {
        summary.enabled++;
      } else {
        summary.disabled++;
      }

      if (rule.enterprise) {
        summary.enterprise++;
      }

      summary.byCategory[rule.category] = (summary.byCategory[rule.category] || 0) + 1;
      summary.bySeverity[rule.severity] = (summary.bySeverity[rule.severity] || 0) + 1;
    }

    return summary;
  }

  generateComplianceReport() {
    const violations = this.getViolations();
    const summary = this.getRulesSummary();

    return {
      timestamp: new Date().toISOString(),
      compliance: {
        overall: violations.length === 0 ? 'PASS' : 'FAIL',
        violations: violations.length,
        rules: summary
      },
      violations: violations.slice(0, 50), // Limit for report
      recommendations: this.generateRecommendations(violations)
    };
  }

  generateRecommendations(violations) {
    const recommendations = [];

    const criticalCount = violations.filter(v => v.severity === 'critical').length;
    const securityCount = violations.filter(v => v.category === 'security').length;

    if (criticalCount > 0) {
      recommendations.push('Address critical violations immediately before deployment');
    }

    if (securityCount > 0) {
      recommendations.push('Security violations detected - conduct security review');
    }

    if (violations.some(v => v.category === 'compliance')) {
      recommendations.push('Compliance violations found - ensure regulatory requirements are met');
    }

    if (recommendations.length === 0) {
      recommendations.push('Code passes all automated checks - consider manual review');
    }

    return recommendations;
  }

  exportRules() {
    return Array.from(this.rules.values()).map(rule => ({
      ...rule,
      enabled: rule.enabled
    }));
  }

  importRules(rulesData) {
    for (const rule of rulesData) {
      this.addRule(rule);
      if (!rule.enabled) {
        this.disableRule(rule.id);
      }
    }
  }
}
