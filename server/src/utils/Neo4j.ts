import neo4j, { Driver, Transaction } from "neo4j-driver";
import { NEO4J_URI, NEO4J_USER, NEO4J_PASSWORD } from "../constants/env";

type Neo4jAuth = {
  uri: string;
  username: string;
  password: string;
};

type Node = {
  label: string;
  properties?: Record<string, any>;
};

type Relationship = {
  startLabel: string;
  startId: string;
  endLabel: string;
  endId: string;
  relationship: string;
  properties?: Record<string, any>;
};

class Neo4jClient {
  private driver: Driver;

  constructor({ uri, username, password }: Neo4jAuth) {
    this.driver = neo4j.driver(uri, neo4j.auth.basic(username, password));
  }

  async createNode({ label, properties = {} }: Node) {
    return this.transaction(async (tx: Transaction) => {
      const query = `CREATE (n:${label}) SET n+=$properties RETURN n`;
      const result = await tx.run(query, { properties });
      return result.records[0].get(0);
    });
  }

  async createRelationship({
    startLabel,
    startId,
    endLabel,
    endId,
    relationship,
    properties = {},
  }: Relationship) {
    return this.transaction(async (tx: Transaction) => {
      const query = `
        MATCH (a:${startLabel}),(b:${endLabel})
        WHERE a.id = $startId AND b.id = $endId
        CREATE (a)-[r:${relationship}]->(b)
        SET r+=$properties
        RETURN r
      `;
      const result = await tx.run(query, { startId, endId, properties });
      return result.records[0].get(0);
    });
  }

  async deleteNode({ label, properties = {} }: Node) {
    return this.transaction(async (tx: Transaction) => {
      const query = `MATCH (n:${label}) WHERE n=$properties DETACH DELETE n`;
      await tx.run(query, { properties });
    });
  }

  async deleteRelationship({
    startLabel,
    startId,
    endLabel,
    endId,
    relationship,
  }: Relationship) {
    return this.transaction(async (tx: Transaction) => {
      const query = `
        MATCH (a:${startLabel})-[r:${relationship}]->(b:${endLabel})
        WHERE a.id = $startId AND b.id = $endId
        DELETE r
      `;
      await tx.run(query, { startId, endId });
    });
  }

  async updateNode({ label, properties = {} }: Node) {
    return this.transaction(async (tx: Transaction) => {
      const query = `MATCH (n:${label}) SET n+=$properties RETURN n`;
      const result = await tx.run(query, { properties });
      return result.records[0].get(0);
    });
  }

  async updateRelationship({
    startLabel,
    startId,
    endLabel,
    endId,
    relationship,
    properties = {},
  }: Relationship) {
    return this.transaction(async (tx: Transaction) => {
      const query = `
        MATCH (a:${startLabel})-[r:${relationship}]->(b:${endLabel})
        WHERE a.id = $startId AND b.id = $endId
        SET r+=$properties
        RETURN r
      `;
      const result = await tx.run(query, { startId, endId, properties });
      return result.records[0].get(0);
    });
  }

  async transaction(callback: (tx: Transaction) => Promise<any>) {
    const session = this.driver.session({ database: "mrs" });
    const tx = session.beginTransaction();
    try {
      const result = await callback(tx);
      await tx.commit();
      return result;
    } catch (error) {
      await tx.rollback();
      throw error;
    } finally {
      await session.close();
    }
  }

  async getInstance() {
    return this.driver;
  }
}

const neo4jClient = new Neo4jClient({
  uri: NEO4J_URI,
  username: NEO4J_USER,
  password: NEO4J_PASSWORD,
});

export default neo4jClient;
