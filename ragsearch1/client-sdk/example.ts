/**
 * RAGSearch1 SDK - Usage Examples
 *
 * Demonstrates how to use the SDK in your application
 */

import RAGSearch1Client from './ragsearch1-sdk';

// ====================
// INITIALIZE CLIENT
// ====================

const client = new RAGSearch1Client({
  baseURL: 'http://localhost:8000',
  // apiKey: 'your-api-key-here', // Optional
  timeout: 30000
});

// ====================
// EXAMPLE 1: Simple Search
// ====================

async function exampleSimpleSearch() {
  console.log('\n=== Example 1: Simple Search ===\n');

  try {
    const results = await client.search({
      query: 'mejores exchanges en México',
      limit: 5
    });

    console.log(`Found ${results.total} results:`);
    results.results.forEach((result, index) => {
      console.log(`\n${index + 1}. ${result.metadata.name}`);
      console.log(`   Type: ${result.metadata.type}`);
      console.log(`   Country: ${result.metadata.country}`);
      console.log(`   Similarity: ${(result.similarity_score * 100).toFixed(1)}%`);
    });
  } catch (error) {
    console.error('Search failed:', error);
  }
}

// ====================
// EXAMPLE 2: Search with Filters
// ====================

async function exampleSearchWithFilters() {
  console.log('\n=== Example 2: Search with Filters ===\n');

  try {
    const results = await client.search({
      query: 'crypto trading',
      limit: 10,
      filters: {
        type: 'exchange',
        country: 'US'
      }
    });

    console.log(`Found ${results.total} US exchanges:`);
    results.results.forEach(result => {
      console.log(`- ${result.metadata.name} (${result.similarity_score.toFixed(3)})`);
    });
  } catch (error) {
    console.error('Filtered search failed:', error);
  }
}

// ====================
// EXAMPLE 3: Ask a Question (RAG)
// ====================

async function exampleAskQuestion() {
  console.log('\n=== Example 3: Ask a Question ===\n');

  try {
    const response = await client.ask({
      question: '¿Cuáles son las mejores opciones para enviar dinero a Venezuela?',
      context_limit: 5
    });

    console.log('Question:', response.question);
    console.log('\nAnswer:');
    console.log(response.answer);
    console.log(`\nConfidence: ${(response.confidence * 100).toFixed(1)}%`);
    console.log('\nSources:');
    response.sources.forEach((source, index) => {
      console.log(`  ${index + 1}. ${source.name} (${source.country})`);
    });
  } catch (error) {
    console.error('Ask failed:', error);
  }
}

// ====================
// EXAMPLE 4: Compare Remittance Options
// ====================

async function exampleCompareRemittance() {
  console.log('\n=== Example 4: Compare Remittance ===\n');

  try {
    const comparison = await client.compareRemittance({
      from_country: 'US',
      to_country: 'VE',
      amount: 100,
      currency: 'USD'
    });

    console.log(`Sending $${comparison.amount} from ${comparison.from_country} to ${comparison.to_country}\n`);
    console.log(`Found ${comparison.total_found} options:\n`);

    comparison.options.forEach((option, index) => {
      console.log(`${index + 1}. ${option.name}`);
      console.log(`   Type: ${option.type}`);
      console.log(`   Match: ${(option.similarity_score * 100).toFixed(1)}%\n`);
    });

    console.log('Recommendation:');
    console.log(comparison.comparison);
  } catch (error) {
    console.error('Comparison failed:', error);
  }
}

// ====================
// EXAMPLE 5: Get BCV Venezuela Rates
// ====================

async function exampleGetBCVRates() {
  console.log('\n=== Example 5: BCV Venezuela Rates ===\n');

  try {
    const rates = await client.getBCVRates();

    console.log('Venezuela Exchange Rates:');
    console.log(`- BCV Official: ${rates.bcv_oficial} VES/USD`);
    console.log(`- Parallel Market: ${rates.paralelo} VES/USD`);
    console.log(`- Binance P2P: ${rates.binance_p2p} VES/USD`);

    console.log('\nValidation:');
    console.log(`- BCV vs Paralelo: ${rates.validation.bcvParaleloDiff.toFixed(2)}% difference`);
    console.log(`- Binance vs Paralelo: ${rates.validation.binanceParaleloDiff.toFixed(2)}% difference`);

    if (rates.validation.alert) {
      console.log(`\n⚠️ Alert: ${rates.validation.alert}`);
    }

    console.log(`\nLast updated: ${rates.last_updated}`);
  } catch (error) {
    console.error('Get BCV rates failed:', error);
  }
}

// ====================
// EXAMPLE 6: Get Entities by Country
// ====================

async function exampleGetEntitiesByCountry() {
  console.log('\n=== Example 6: Get Entities by Country ===\n');

  try {
    const entities = await client.getEntitiesByCountry('VE', 10);

    console.log(`Venezuelan Financial Institutions (${entities.length}):\n`);
    entities.forEach((entity, index) => {
      console.log(`${index + 1}. ${entity.metadata.name}`);
      console.log(`   Type: ${entity.metadata.type}`);
      console.log(`   API: ${entity.metadata.api_available ? 'Available' : 'Not Available'}\n`);
    });
  } catch (error) {
    console.error('Get entities failed:', error);
  }
}

// ====================
// EXAMPLE 7: Get Collection Stats
// ====================

async function exampleGetStats() {
  console.log('\n=== Example 7: Collection Stats ===\n');

  try {
    const stats = await client.getStats();

    console.log('Database Statistics:');
    console.log(`- Collection: ${stats.name}`);
    console.log(`- Total Entities: ${stats.count}`);
    console.log(`- Metadata:`, stats.metadata);
  } catch (error) {
    console.error('Get stats failed:', error);
  }
}

// ====================
// EXAMPLE 8: Health Check
// ====================

async function exampleHealthCheck() {
  console.log('\n=== Example 8: Health Check ===\n');

  try {
    const health = await client.healthCheck();

    console.log('API Status:');
    console.log(`- Status: ${health.status}`);
    console.log(`- App: ${health.app}`);
    console.log(`- Version: ${health.version}`);
  } catch (error) {
    console.error('Health check failed:', error);
  }
}

// ====================
// RUN ALL EXAMPLES
// ====================

async function runAllExamples() {
  console.log('🚀 RAGSearch1 SDK Examples\n');
  console.log('='.repeat(50));

  await exampleHealthCheck();
  await exampleSimpleSearch();
  await exampleSearchWithFilters();
  await exampleAskQuestion();
  await exampleCompareRemittance();
  await exampleGetBCVRates();
  await exampleGetEntitiesByCountry();
  await exampleGetStats();

  console.log('\n' + '='.repeat(50));
  console.log('\n✅ All examples completed!\n');
}

// Run examples if executed directly
if (require.main === module) {
  runAllExamples().catch(error => {
    console.error('Error running examples:', error);
    process.exit(1);
  });
}

export {
  exampleSimpleSearch,
  exampleSearchWithFilters,
  exampleAskQuestion,
  exampleCompareRemittance,
  exampleGetBCVRates,
  exampleGetEntitiesByCountry,
  exampleGetStats,
  exampleHealthCheck
};
