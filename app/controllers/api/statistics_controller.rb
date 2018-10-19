class API::StatisticsController < ApplicationController
  respond_to :json

  def index
    @statistics = TerrasAPI.statistics(
      statistics_params[:territory_id],
      statistics_params[:classification_id],
      statistics_params[:grouped]
    )

    respond_with(@statistics)
  end

  def collection_2
    @statistics = TerrasAPI.collection_2_statistics(
      statistics_params[:territory_id],
      statistics_params[:classification_id],
      statistics_params[:grouped]
    )

    respond_with(@statistics)
  end

  def infra
    @statistics = TerrasAPI.infra_statistics(
      infra_statistics_params[:territory_id],
      infra_statistics_params[:level_id],
      infra_statistics_params[:buffer],
      infra_statistics_params[:classification_ids]
    )

    respond_with(@statistics)
  end

  private

  def statistics_params
    params.permit(:territory_id, :classification_id, :grouped)
  end

  def infra_statistics_params
    params.permit(:territory_id, :level_id, :buffer, :classification_ids)
  end
end
